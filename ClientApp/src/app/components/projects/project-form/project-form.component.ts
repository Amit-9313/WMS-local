import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent {

  project: any = {
    projectCode: '',
    projectName: '',
    customerId: '',
    warehouseId: '',
    mechanicalDate: '',
    electricalDate: '',
    cabinDate: '',
    testDate: '',
    assignedTeam: ''
  };

  save() {
    console.log(this.project);
  }

}
