import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Inspection, Item } from '../../models';

@Component({
  selector: 'app-quality',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quality.component.html',
  styleUrls: ['./quality.component.css']
})
export class QualityComponent implements OnInit {
  showForm = false;
  inspections: Inspection[] = [];
  items: Item[] = [];
  form: any = { itemId: '', inspectionType: 'Incoming', sampleQty: 1, passQty: 0, failQty: 0 };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadInspections();
    this.api.get<Item[]>('/item').subscribe(d => this.items = d || []);
  }

  loadInspections(): void {
    this.api.get<Inspection[]>('/purchase/inspections').subscribe(d => this.inspections = d || []);
  }

  createInspection(): void {
    this.api.post<any>('/purchase/inspections', this.form).subscribe(() => {
      this.loadInspections();
      this.showForm = false;
    });
  }
}
