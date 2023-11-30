import { Component, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { TreeNode } from '../entities/userData';
import { UserService } from '../services/user.service';


const nodeData = [
  {
    name: 'Test User',
    children: [
      { name: 'PhoneNumber: 079321231' },
      { name: 'Status: Out of Office' },
      { name: 'Stellvertreter: Name stv' },
      {
        name: 'Test User',
        children: [
          { name: 'PhoneNumber: 079321231' },
          { name: 'Status: Out of Office' },
          { name: 'Stellvertreter: Name stv' },
        ]
      }
    ]
  }
];


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {

  treeControl = new NestedTreeControl<TreeNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<TreeNode>();

  constructor(private userService: UserService) {

    this.userService.userSubject.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

}
