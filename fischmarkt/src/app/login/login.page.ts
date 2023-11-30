import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Parse from 'parse';
import { AntraegeService } from '../services/antraege.service';
import { FishTypeService } from '../services/fish-type.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private route: ActivatedRoute,
    private router: Router,
    private antraegeService: AntraegeService,
    private userService: UserService,
    private fishTypeService: FishTypeService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      if (params.token) {
        Parse.User.become(params.token).then(async user => {
          //    this.router.navigateByUrl('/');

          if (!this.antraegeService.userFishes ||
            !this.antraegeService.allAntraege ||
            !this.userService.allUsers ||
            !this.fishTypeService.allFishTypes) {

            const alltasks = [] as Promise<any>[];
            alltasks.push(this.antraegeService.getAntraege());
            alltasks.push(this.antraegeService.getFishis());
            alltasks.push(this.userService.loadAllUsers());
            alltasks.push(this.fishTypeService.loadAllFishTypes());

            for (let item of alltasks) {
              await item;
            }

            // await this.antraegeService.getAntraege();
            // await this.antraegeService.getFishis();
            // await this.userService.loadAllUsers();
            // await this.fishTypeService.loadAllFishTypes();
          }
          this.router.navigate(['/tabs/tab1'], { replaceUrl: true });
        }, error => {
          alert('Es ist ein fehler aufgetreten. Versuche es erneut.');
          console.error(error);
        });
      }
    });
  }

}
