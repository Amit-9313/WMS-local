import { Injectable } from '@angular/core';

export interface Model {
  id: number;
  modelName: string;
  modelNumber: string;
  description: string;
  hsnCode: string;
  sellingPrice: number;
  costPrice: number;
  quantity: number;
  status: 'Good' | 'Defective';
  location: string;
  assignment: string;
  timeline: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  private models: Model[] = [
    {
      id: 1,
      modelName: 'Samsung LED 75"',
      modelNumber: 'MDL-1001',
      description: 'Smart LED Television',
      hsnCode: '8528',
      sellingPrice: 85000,
      costPrice: 72000,
      quantity: 12,
      status: 'Good',
      location: 'Warehouse A',
      assignment: 'Project Alpha',
      timeline: '2026-06-12'
    },
    {
      id: 2,
      modelName: 'Samsung LED 55"',
      modelNumber: 'MDL-1002',
      description: 'Smart LED Television',
      hsnCode: '8528',
      sellingPrice: 55000,
      costPrice: 45000,
      quantity: 8,
      status: 'Good',
      location: 'Warehouse B',
      assignment: 'Project Beta',
      timeline: '2026-06-15'
    }
  ];

  getModels(): Model[] {
    return this.models;
  }

  getModelById(id: number): Model | undefined {
    return this.models.find(x => x.id === id);
  }

  addModel(model: Model): void {

    const newId =
      this.models.length > 0
        ? Math.max(...this.models.map(x => x.id)) + 1
        : 1;

    this.models.push({
      ...model,
      id: newId
    });
  }

  updateModel(updatedModel: Model): void {

    const index = this.models.findIndex(
      x => x.id === updatedModel.id
    );

    if (index !== -1) {
      this.models[index] = {
        ...updatedModel
      };
    }
  }

  deleteModel(id: number): void {
    this.models = this.models.filter(
      x => x.id !== id
    );
  }
}
