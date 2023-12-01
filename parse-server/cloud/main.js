const { addMinutes } = require('./date-utils');
const { updateInfomaniakPingDns, wait, sendSms } = require('./utils');

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const phoneNumberRegex =
  /(\b(0041)|\B\+41)(\s?\(0\))?(\s)?[1-9]{2}(\s)?[0-9]{3}(\s)?[0-9]{2}(\s)?[0-9]{2}\b/;

Parse.Cloud.define('getRolesFromUser', async request => {
  const userId = request.params.userId;
  if (request.user && isUserIdInRole(request.user.id, 'admin') && userId) {
    return await getRolesFromUser(userId);
  } else {
    return [];
  }
});

Parse.Cloud.define('addUserToRole', async request => {
  const userId2Delete = request.params.roleName;
  if (request.user && isUserIdInRole(request.user.id, 'admin') && userId2Delete) {
    await addUser2Role(request.params.roleName, request.params.user);
    return true;
  } else {
    throw 'User is not authorized.';
  }
});

Parse.Cloud.define('removeRoleFromUser', async request => {
  const userId2Delete = request.params.roleName;
  if (request.user && isUserIdInRole(request.user.id, 'admin') && userId2Delete) {
    await removeRoleFromUser(request.params.roleName, request.params.user);
    return true;
  } else {
    throw 'User is not authorized.';
  }
});

Parse.Cloud.define('deleteUser', async request => {
  const userId2Delete = request.params.user2delete;
  if (request.user && isUserIdInRole(request.user.id, 'admin') && userId2Delete) {
    const query = new Parse.Query('User');
    query.equalTo('objectId', userId2Delete);
    const user2Delete = await query.first({ useMasterKey: true });

    await user2Delete.destroy({ useMasterKey: true });
    return true;
  } else {
    throw 'User is not authorized to delete user.';
  }
});

Parse.Cloud.define('changePassword', async request => {
  const userId = request.params.userId;
  const newPassword = request.params.newPassword;
  if (request.user && isUserIdInRole(request.user.id, 'admin') && userId && newPassword) {
    const query = new Parse.Query('User');
    query.equalTo('objectId', userId);
    const user2Delete = await query.first({ useMasterKey: true });

    user2Delete.set('password', newPassword);
    await user2Delete.save(null, { useMasterKey: true });
    return true;
  } else {
    throw 'User is not authorized to change password.';
  }
});

Parse.Cloud.define('setStatus', async request => {
  const userId = request.params.userId;
  const newStatusId = request.params.newStatusId;
  if (request.user && isUserIdInRole(request.user.id, 'admin') && userId && newStatusId) {
    const query = new Parse.Query('User');
    query.equalTo('objectId', userId);
    const user2Update = await query.first({ useMasterKey: true });

    const query2 = new Parse.Query('status');
    query2.equalTo('objectId', newStatusId);
    const status = await query2.first({ useMasterKey: true });

    user2Update.set('status', status);
    await user2Update.save(null, { useMasterKey: true });
    return true;
  } else {
    throw 'User is not authorized to change status.';
  }
});

Parse.Cloud.beforeSave('_User', async request => {
  // Diables user registration if param is set AllowUserRegistrations.
  if (
    request.original == null &&
    (await getParameterValueByKey('AllowUserRegistrations')) != 'true'
  ) {
    throw 'Currently user registrations are not allowed.';
  }

  // new user
  if (request.original == null) {
    request.object.set('firstname', '');
    request.object.set('lastname', '');
    request.object.set('status', await getRandomStatus());
    request.object.set('department', await getRandomDepartment());

    console.log('Setting default properties for user with id ' + request.object.id + '.');

    // ACL Berechtigungen
    const acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    acl.setPublicWriteAccess(false);

    acl.setWriteAccess('admin', true);
    acl.setReadAccess('admin', true);

    acl.setWriteAccess('user', false);
    acl.setReadAccess('user', true);
    request.object.setACL(acl);

    console.log('Setting default permitions for user with id ' + request.object.id + '.');
  }
});

Parse.Cloud.afterSave('_User', async request => {
  const isUserAlreadyInRole = await isUserInRole(request.object, 'user');
  if (!isUserAlreadyInRole && request.original == null) {
    const query = new Parse.Query('_Role');
    query.equalTo('name', 'user');
    const userRole = await query.first();

    const relation = userRole.relation('users');
    relation.add(request.object);
    await userRole.save(null, { useMasterKey: true });

    await addUser2Role('bfa-user', request.object);
    //await addUser2Role('fm-user', request.object);
    //await addUser2Role('geo-tracking', request.object);

    console.log('Added user with id ' + request.object.id + ' to role user and bfa-user.');
  }
});

Parse.Cloud.beforeSave('Sms', async request => {
  if (request.original) {
    throw 'Cannot modify already created sms message.';
  }

  const fields2BeSet = ['text', 'phone'];
  for (const field of fields2BeSet) {
    if (!request.object.get(field)) {
      throw `Field ${field} must be set.`;
    }
  }
  let phone = request.object.get('phone');
  if (phone?.length === 10) {
    phone = '+41' + phone.substring(1);
    request.object.set('phone', phone);
  }

  if (!phoneNumberRegex.test(phone)) {
    throw 'The phone field does not match the criteria for a swiss phone number: ' + phone;
  }
});

Parse.Cloud.afterSave('Sms', async request => {
  if (request.original) {
    return;
  }
  await updateInfomaniakPingDns();
  wait(5).then(() => sendSms(request.object.get('phone'), request.object.get('text')));
});


Parse.Cloud.afterSave('FM_Aquarium', async request => {

  const fishType = await getFishTypeById(request.object.get('fishType')?.id);
  const creator = await getUserById(request.object.get('creator')?.id)
  const user = await getUserById(request.object.get('user')?.id);

  if (!request.original && !request.object.get('approved') && user?.get('telefoneNumber')) {
    const GameScore = Parse.Object.extend("Sms");
    const gameScore = new GameScore();
    gameScore.set("phone", user.get('telefoneNumber'));
    gameScore.set("text", `Hey ${user.get('firstname')}. Du hast einen neuen ${fishType.get('name') || 'Fisch'}-Antrag von ${creator?.get('firstname')} ${creator?.get('lastname')} erhalten. Begründung: ${request.object.get('reason')}.`);
    await gameScore.save(null, { useMasterKey: true });
  }

  if (request.object.get('approved') && user?.get('telefoneNumber')) {
    const GameScore = Parse.Object.extend("Sms");
    const gameScore = new GameScore();
    gameScore.set("phone", user.get('telefoneNumber'));
    gameScore.set("text", `Hey ${user.get('firstname')}. Der ${fishType.get('name') || 'Fisch'}-Antrag von ${creator?.get('firstname')} ${creator?.get('lastname')} wurde bewilligt. Begründung: ${request.object.get('reason')}.`);
    await gameScore.save(null, { useMasterKey: true });
  }
});

async function getFishTypeById(fishTypeId) {
  const GameScore = Parse.Object.extend('FM_FishType');
  const query = new Parse.Query(GameScore);
  return await query.get(fishTypeId, { useMasterKey: true });
}

async function getUserById(fishTypeId) {
  const GameScore = Parse.Object.extend('_User');
  const query = new Parse.Query(GameScore);
  return await query.get(fishTypeId, { useMasterKey: true });
}

Parse.Cloud.define('getFishRanking', async request => {
  const isUserAlreadyInRole = await isUserInRole(request.object, 'fm-user');
  if (!isUserAlreadyInRole) {
    const GameScore = Parse.Object.extend('FM_Aquarium');
    const query = new Parse.Query(GameScore);
    query.equalTo('approved', true);
    query.include('fishType');
    query.include('user');
    query.limit(10000);
    const fishies = await query.find({ useMasterKey: true });
    const fishes = fishies.filter(fish => !!fish.get('user'));

    const returnVal = [];
    const groupedByUser = groupFishies(fishes, 'id');

    for (const userId in groupedByUser) {
      const antraegeOfUser = groupedByUser[userId];
      if (antraegeOfUser?.length > 0) {
        const pointsOfUser = antraegeOfUser.reduce(
          (sum, current) => sum + current.get('fishType').attributes.points,
          0
        );
        returnVal.push({
          points: pointsOfUser,
          user: antraegeOfUser[0].get('user'),
        });
      }
    }

    returnVal.sort(function (a, b) {
      return b.points - a.points;
    });
    return returnVal.filter(x => !!x?.user?.id);
  }
  return [];
});

Parse.Cloud.afterSave('locationStatus', async request => {
  if (!request.user) {
    return;
  }
  const query = new Parse.Query('locationStatus');
  query.equalTo('user', request.user);
  query.lessThan('createdAt', addMinutes(new Date(), -10));
  query.limit(100000);
  const locationStatuss = await query.find({ useMasterKey: true });
  await Parse.Object.destroyAll(locationStatuss, { useMasterKey: true });
});

Parse.Cloud.define('resetBfaSaldo', async request => {
  const userId = request.params.userId;
  const allowedRole = isUserIdInRole(request.user.id, 'admin') || isUserIdInRole(request.user.id, 'bfa-admin');
  if (!request.user || !allowedRole || !userId) {
    throw 'User is not authorized to reset saldo.';
  }

  const user2ResetSaldo = await getUserById(userId);
  if (!user2ResetSaldo) {
    throw 'User not found with id: ' + userId;
  }

  const orderQuery = new Parse.Query('BFA_Orders');
  orderQuery.equalTo('user', user2ResetSaldo);
  const ordersOfUser = await orderQuery.find({ useMasterKey: true });
  await Parse.Object.destroyAll(ordersOfUser, { useMasterKey: true });

  const oderProdQuery = new Parse.Query('BFA_OrderProducts');
  oderProdQuery.equalTo('user', user2ResetSaldo);
  const orderProductsOfUser = await oderProdQuery.find({ useMasterKey: true });
  await Parse.Object.destroyAll(orderProductsOfUser, { useMasterKey: true });

});

function groupFishies(xs, key) {
  return xs.reduce((rv, x) => {
    const userId = x?.attributes?.user?.id ?? 'unknown user';
    (rv[userId] = rv[userId] || []).push(x);
    return rv;
  }, {});
}

async function addUser2Role(roleName, userObject) {
  const query = new Parse.Query('_Role');
  query.equalTo('name', roleName);
  const userRole = await query.first();

  const relation = userRole.relation('users');
  relation.add(userObject);
  await userRole.save(null, { useMasterKey: true });
}

async function removeRoleFromUser(roleName, userObject) {
  const query = new Parse.Query('_Role');
  query.equalTo('name', roleName);
  const userRole = await query.first();

  const relation = userRole.relation('users');
  relation.remove(userObject);
  await userRole.save(null, { useMasterKey: true });
}

async function isUserInRole(user, roleName) {
  return isUserIdInRole(user, roleName);
}

async function isUserIdInRole(userId, roleName) {
  const User = Parse.Object.extend('_User');
  const Role = Parse.Object.extend('_Role');

  const innerQuery = new Parse.Query(User);
  innerQuery.equalTo('objectId', userId);

  const query = new Parse.Query(Role);
  query.equalTo('name', roleName);
  query.matchesQuery('users', innerQuery);

  const comments = await query.find({ useMasterKey: true });

  return comments ? comments.length > 0 : false;
}

async function getParameterValueByKey(key) {
  const GameScore = Parse.Object.extend('parameter');
  const query = new Parse.Query(GameScore);
  query.equalTo('key', key);
  const param = await query.first({ useMasterKey: true });
  if (param == null) {
    return '';
  } else {
    return param.attributes.value;
  }
}

async function getRandomStatus() {
  const GameScore = Parse.Object.extend('status');
  const query = new Parse.Query(GameScore);
  return await query.first({ useMasterKey: true });
}

async function getRandomDepartment() {
  const GameScore = Parse.Object.extend('department');
  const query = new Parse.Query(GameScore);
  return await query.first({ useMasterKey: true });
}

async function getRolesFromUser(userId) {
  const query = new Parse.Query('_Role');
  query.equalTo('users', userId);
  const userRole = await query.first({ useMasterKey: true });
  return userRole;
}