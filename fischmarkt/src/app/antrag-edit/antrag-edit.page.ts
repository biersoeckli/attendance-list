import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AntraegeService } from '../services/antraege.service';
import { FishTypeService } from '../services/fish-type.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-antrag-edit',
  templateUrl: './antrag-edit.page.html',
  styleUrls: ['./antrag-edit.page.scss'],
})
export class AntragEditPage implements OnInit {

  filteredUsers: any[];

  reason: string;
  selectedFishType: any;
  selectedUser: any;

  searchString: string = '';
  
  ios: boolean;
  android: boolean;

  constructor(private userService: UserService,
    public fishTypeService: FishTypeService,
    public antragService: AntraegeService,
    private router: Router, 
    public platform: Platform) {
      this.ios = platform.is('ios');
      this.android = platform.is('android');

    if (!this.userService.allUsers || this.userService.allUsers.length === 0) {
      this.userService.loadAllUsers().then(() => {
        this.filterUsers();
      })
    } else {
      this.filterUsers();
    }

    if (!this.fishTypeService.allFishTypes || this.fishTypeService.allFishTypes.length === 0) {
      this.fishTypeService.loadAllFishTypes();
    }
  }

  ngOnInit() {
  }

  filterUsers() {
    const searchStringg = this.searchString.toLowerCase();
    this.filteredUsers = this.userService.allUsers.filter(x => {
      const itemSearchstring = x.attributes.firstname.toLowerCase() + x.attributes.lastname.toLowerCase();
      return itemSearchstring.indexOf(searchStringg) > -1;
    });
  }

  setFischType(event) {
    this.selectedFishType = event?.detail?.value;    
  }

  async saveAntrag() {
   await this.antragService.saveAntrag(this.selectedUser, this.selectedFishType, this.reason);
   this.router.navigateByUrl('/tabs/tab2');
  }
}