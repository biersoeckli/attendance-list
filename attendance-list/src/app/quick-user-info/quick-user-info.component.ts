import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { UserService } from '../services/user.service';
import { UserStatus } from '../entities/userStatus';

@Component({
  selector: 'app-quick-user-info',
  templateUrl: './quick-user-info.component.html',
  styleUrls: ['./quick-user-info.component.scss']
})
export class QuickUserInfoComponent implements OnInit, OnChanges {

  @Input() userId: any;
  @Input() imageWidth: any;
  @Input() isCurrentUser: boolean;
  @Input() showStatus: boolean;
  @Input() showUsername: boolean;
  userStatus: UserStatus;
  imageWidthPixel: string;

  constructor(private userService: UserService) {

  }

  ngOnChanges(): void {
    this.userService.allUserStatus.subscribe(data => {
      if (data) {
        this.userStatus = data.find(x => x.user.id === this.userId);
      }
    });
    this.imageWidthPixel = this.imageWidth + 'px';
  }

  ngOnInit(): void {

  }

}
