import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import {
  ModelUploadService
} from '../../../services/model-upload.service';
import {
  ModelService,
  Model
} from '../../../services/model-master.service';

@Component({
  selector: 'app-model-master',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './model-master.component.html',
  styleUrls: ['./model-master.component.css']
})
export class ModelMasterComponent implements OnInit {

  constructor(
    private router: Router,
    private modelService: ModelService,
    private modelUploadService: ModelUploadService
  ) { }

  searchText = '';

  models: Model[] = [];

  ngOnInit(): void {
    this.loadModels();
  }

  loadModels(): void {

    this.models =
      this.modelService.getModels();

  }

  get filteredModels(): Model[] {

    return this.models.filter(model =>
      model.modelName
        .toLowerCase()
        .includes(this.searchText.toLowerCase()) ||

      model.modelNumber
        .toLowerCase()
        .includes(this.searchText.toLowerCase())
    );

  }

  createModel(): void {
    this.router.navigate(['/create-model']);
  }

  editModel(id: number): void {
    this.router.navigate(['/edit-model', id]);
  }

  viewModel(id: number): void {
    this.router.navigate(['/view-model', id]);
  }

  deleteModel(id: number): void {

    if (!confirm('Delete Model ?')) {
      return;
    }

    this.modelService.deleteModel(id);

    this.loadModels();
  }

  async onFileSelected(
    event: any
  ): Promise<void> {

    const file =
      event.target.files[0];

    if (!file) {
      return;
    }

    try {

      const uploadedModels =
        await this.modelUploadService
          .parseExcel(file);

      this.modelService
        .bulkUploadModels(
          uploadedModels
        );

      this.loadModels();

      alert(
        `${uploadedModels.length}
      models uploaded successfully`
      );

    }
    catch {

      alert(
        'Invalid Excel File'
      );
    }
  }
}
