import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

import { Model } from './model-master.service';

@Injectable({
  providedIn: 'root'
})
export class ModelUploadService {

  constructor() { }

  parseExcel(file: File): Promise<Model[]> {

    return new Promise((resolve, reject) => {

      const reader = new FileReader();

      reader.onload = (e: any) => {

        try {

          const workbook = XLSX.read(
            e.target.result,
            { type: 'binary' }
          );

          const sheetName =
            workbook.SheetNames[0];

          const worksheet =
            workbook.Sheets[sheetName];

          const excelData: any[] =
            XLSX.utils.sheet_to_json(
              worksheet
            );

          const models: Model[] =
            excelData.map(
              (row: any) => ({

                id: 0,

                modelName:
                  row['Model Name'] || '',

                modelNumber:
                  row['Model Number'] || '',

                description:
                  row['Description'] || '',

                hsnCode:
                  row['HSN Code'] || '',

                sellingPrice:
                  Number(row['Selling Price']) || 0,

                costPrice:
                  Number(row['Cost Price']) || 0,

                quantity:
                  Number(row['Qty']) || 0,

                updatedBy:
                  'Bulk Upload',

                updatedOn:
                  new Date().toLocaleString()

              })
            );

          resolve(models);

        } catch (error) {

          reject(error);

        }

      };

      reader.onerror = () => {

        reject('Unable to read file');

      };

      reader.readAsBinaryString(file);

    });

  }

}
