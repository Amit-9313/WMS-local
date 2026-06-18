import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Package } from '../../models';

@Component({
  selector: 'app-packing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './packing.component.html',
  styleUrls: ['./packing.component.css']
})
export class PackingComponent implements OnInit {

  activeTab = 'staging';
  showCreateForm = false;

  packages: Package[] = [];
  projects: any[] = [];


  scanCode = '';

  scannedItems: string[] = [];
  stagingItems = [
    {
      project: 'Solar Plant',
      stage: '2T',
      pickTask: 'PT-2026-458',
      items: 12,
      qty: 145
    },
    {
      project: 'Metro Rail',
      stage: '3',
      pickTask: 'PT-2026-459',
      items: 8,
      qty: 82
    }
  ];

  pkgForm: any = {
    projectId: '',
    stageCode: '',
    weightKg: 0,
    declaredValue: 0,
    isHazmatPackage: false,
    labelTemplate: 'Standard',

    lengthCm: 0,
    widthCm: 0,
    heightCm: 0,
  };

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.loadPackages();

    this.api.get<any[]>('/project')
      .subscribe(d => this.projects = d || []);
  }

  loadPackages(): void {
    this.api.get<Package[]>('/pack')
      .subscribe(d => this.packages = d || []);
  }

  createPackage(): void {
    this.api.post('/pack', this.pkgForm)
      .subscribe(() => {
        this.loadPackages();
        this.showCreateForm = false;
      });
  }

  sealPackage(p: any): void {
    this.api.put('/pack/' + p.packageId + '/seal', {})
      .subscribe(() => this.loadPackages());
  }

  printLabel(pkg: any): void {
    alert('Barcode + QR label generated');
  }

  addScan(): void {

    if (!this.scanCode) return;

    this.scannedItems.push(this.scanCode);

    this.scanCode = '';

  }

  get sealedPackagesCount(): number {
    return this.packages.filter(p => p.status === 'Sealed').length;
  }

  get readyDispatchCount(): number {
    return this.packages.filter(p => p.status === 'Sealed').length;
  }
}
