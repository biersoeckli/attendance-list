
if (process.env.IS_PRODUCTION !== undefined) {

  const fs = require('fs');
  const targetPath = './src/environments/environment.generated.ts';
  const colors = require('colors');

  // `environment.prod.ts` file structure
  const envConfigFile = `export const environment = {
    production: ${process.env.IS_PRODUCTION},
    parseServerUrl: '${process.env.PARSE_SERVER_URL}',
    parseAppId: '${process.env.PARSE_APP_ID}',
    attendanceListUrl: '${process.env.ATTENDANCE_LIST_URL}'
  };
`;

  console.log(colors.magenta('The file `environment.prod.ts` will be written with the following content: \n'));
  console.log(colors.grey(envConfigFile));
  fs.writeFileSync(targetPath, envConfigFile);

} else {
  console.log('Prod configuration file will not be published, because the environment parameters are null.');
}
