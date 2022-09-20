import { Component, OnInit } from '@angular/core';
import { ParameterService } from '../services/parameter.service';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private paramService: ParameterService, private snackbar: MatSnackBar) { }

  parameters: any[];

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    this.parameters = await this.paramService.getParams();
  }

  async saveItem(item: any) {
    const saveRes = await this.paramService.saveParameter(item);
    await this.loadData();

    if (!saveRes) {
      this.snackbar.open('Es ist ein Fehler aufgetreten.', null, {
        duration: 3000
      });
    }
  }

  async editItem(item) {

    Swal.fire({
      title: item.attributes.key,
      input: 'text',
      inputValue: item.attributes.value,
      showCancelButton: true,
      confirmButtonText: 'Sichern',
      cancelButtonText: 'Abbrechen',
      showLoaderOnConfirm: true
    }).then((result) => {
      if (result.value) {
        item.set('value', result.value);
        this.saveItem(item);
      }
    });
  }
}
