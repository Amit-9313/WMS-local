import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelService, Model } from '../../../../services/model-master.service';

@Component({
  selector: 'app-edit-model',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-model.component.html',
  styleUrls: ['./edit-model.component.css']
})
export class EditModelComponent implements OnInit {

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modelService: ModelService
  ) { }

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    const model = this.modelService.getModelById(id);

    if (model) {
      this.modelForm = { ...model };
    }
  }

  update(): void {

    this.modelForm.updatedBy =
      'Renushree Wadhi';

    this.modelForm.updatedOn =
      new Date().toLocaleString();

    this.modelService.updateModel(
      this.modelForm
    );

    this.router.navigate([
      '/model-master'
    ]);
  }

  cancel(): void {
    this.router.navigate(['/model-master']);
  }
}
