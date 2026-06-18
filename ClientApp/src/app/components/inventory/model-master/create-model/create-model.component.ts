import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModelService, Model } from '../../../../services/model-master.service';

@Component({
  selector: 'app-create-model',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-model.component.html',
  styleUrls: ['./create-model.component.css']
})
export class CreateModelComponent {

  constructor(
    private modelService: ModelService,
    private router: Router
  ) { }

  modelForm: Model = {
    id: 0,
    modelName: '',
    modelNumber: '',
    description: '',
    hsnCode: '',
    sellingPrice: 0,
    costPrice: 0,
    quantity: 0
  };

  save(): void {

    const currentUser = 'Renushree Wadhi';

    const now =
      new Date().toLocaleString();


    this.modelForm.updatedBy = currentUser;
    this.modelForm.updatedOn = now;

    this.modelService.addModel({
      ...this.modelForm
    });

    this.router.navigate([
      '/model-master'
    ]);
  }

  cancel(): void {

    this.router.navigate([
      '/model-master'
    ]);
  }
}
