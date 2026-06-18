import { Injectable } from '@angular/core';

// Uncomment when backend is connected
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

export interface Model {

  id: number;

  modelName: string;
  modelNumber: string;

  description: string;

  hsnCode: string;

  sellingPrice: number;
  costPrice: number;

  quantity: number;

  updatedBy?: string;
  updatedOn?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  // Backend URL

  // private apiUrl =
  // 'https://localhost:5000/api/models';

  constructor(
    // private http: HttpClient
  ) { }

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
      updatedBy: 'System',
      updatedOn: 'Initial Data'
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
      updatedBy: 'System',
      updatedOn: 'Initial Data'
    }

  ];

  getModels(): Model[] {

    return [...this.models];

    // Backend Version

    // return this.http.get<Model[]>(
    //   this.apiUrl
    // );
  }

  getModelById(
    id: number
  ): Model | undefined {

    return this.models.find(
      x => x.id === id
    );

    // Backend Version

    // return this.http.get<Model>(
    //   `${this.apiUrl}/${id}`
    // );
  }

  addModel(
    model: Model
  ): void {

    const newId =

      this.models.length > 0

        ? Math.max(
          ...this.models.map(
            x => x.id
          )
        ) + 1

        : 1;

    this.models.push({

      ...model,

      id: newId,

      updatedBy: 'Admin',

      updatedOn:
        new Date().toLocaleString()
    });

    // Backend Version

    // return this.http.post(
    //   this.apiUrl,
    //   model
    // );
  }

  updateModel(
    updatedModel: Model
  ): void {

    const index =
      this.models.findIndex(
        x => x.id === updatedModel.id
      );

    if (index !== -1) {

      this.models[index] = {

        ...updatedModel,

        updatedBy: 'Admin',

        updatedOn:
          new Date().toLocaleString()
      };
    }

    // Backend Version

    // return this.http.put(
    //   `${this.apiUrl}/${updatedModel.id}`,
    //   updatedModel
    // );
  }

  deleteModel(
    id: number
  ): void {

    this.models =
      this.models.filter(
        x => x.id !== id
      );

    // Backend Version

    // return this.http.delete(
    //   `${this.apiUrl}/${id}`
    // );
  }

  bulkUploadModels(
    uploadedModels: Model[]
  ): void {

    const startId =

      this.models.length > 0

        ? Math.max(
          ...this.models.map(
            x => x.id
          )
        ) + 1

        : 1;

    uploadedModels.forEach(
      (model, index) => {

        this.models.push({

          ...model,

          id: startId + index,

          updatedBy: 'Bulk Upload',

          updatedOn:
            new Date().toLocaleString()
        });

      });

    // Backend Version

    // return this.http.post(
    //   `${this.apiUrl}/bulk-upload`,
    //   uploadedModels
    // );
  }

  increaseQuantity(
    modelId: number
  ): void {

    const model =
      this.models.find(
        x => x.id === modelId
      );

    if (model) {

      model.quantity++;

      model.updatedOn =
        new Date().toLocaleString();
    }
  }

 
  decreaseQuantity(
    modelId: number
  ): void {

    const model =
      this.models.find(
        x => x.id === modelId
      );

    if (
      model &&
      model.quantity > 0
    ) {

      model.quantity--;

      model.updatedOn =
        new Date().toLocaleString();
    }
  }

  clearAllModels(): void {

    this.models = [];
  }
}
