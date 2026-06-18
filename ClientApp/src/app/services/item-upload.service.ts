import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

import {
  InventoryItem
} from './item.service';

@Injectable({
  providedIn: 'root'
})
export class ItemUploadService {

  constructor() { }

  parseExcel(
    file: File
  ): Promise<InventoryItem[]> {

    return new Promise((resolve, reject) => {

      const reader =
        new FileReader();

      reader.onload = (e: any) => {

        try {

          const workbook =
            XLSX.read(
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

          const items: InventoryItem[] =
            excelData.map(
              (row: any) => ({

                itemId: '',

                modelId: '',

                modelName:
                  row['Model Name'] || '',

                modelNumber:
                  row['Model Number'] || '',

                serialNumber:
                  row['Serial Number'] || '',

                barcode:
                  row['Serial Number'] || '',

                qrCode:
                  row['Serial Number'] || '',

                warehouse:
                  row['Warehouse'] || '',

                rack:
                  row['Rack'] || '',

                shelf:
                  row['Shelf'] || '',

                bin:
                  row['Bin'] || '',

                project:
                  row['Project'] || '',

                assignmentId:
                  row['Assignment ID'] || '',

                status:
                  row['Status'] || 'Good'

              }))
            ;

          resolve(items);

        }
        catch (error) {

          reject(error);

        }

      };

      reader.onerror = () =>
        reject(
          'Unable To Read File'
        );

      reader.readAsBinaryString(
        file
      );

    });

  }

}
