import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  selectedReport: any = null;
  reportData: any[] = [];
  reports = [
    { label: 'Stock Summary', desc: 'Current stock levels by SKU', endpoint: '/inventory', bg: 'rgba(14,165,233,0.12)', icon: '<rect x=\"3\" y=\"3\" width=\"7\" height=\"9\" rx=\"1\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"5\" rx=\"1\"/>', headers: ['SKU', 'Item', 'Bin', 'On Hand', 'Available'] },
    { label: 'Stock Ledger', desc: 'Detailed stock movements', endpoint: '/inventory/movements', bg: 'rgba(16,185,129,0.12)', icon: '<polyline points=\"22 12 18 12 15 21 9 3 6 12 2 12\"/>', headers: ['Transaction#', 'Type', 'Item', 'Qty', 'Date'] },
    { label: 'Aging Analysis', desc: 'Inventory aging report', endpoint: '/inventory/aging', bg: 'rgba(139,92,246,0.12)', icon: '<circle cx=\"12\" cy=\"12\" r=\"10\"/><polyline points=\"12 6 12 12 16 14\"/>', headers: ['SKU', 'Item', 'Age (Days)', 'Qty', 'Zone'] },
    { label: 'ABC Analysis', desc: 'ABC classification report', endpoint: '/inventory/abc', bg: 'rgba(245,158,11,0.12)', icon: '<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><line x1=\"9\" y1=\"3\" x2=\"9\" y2=\"21\"/>', headers: ['SKU', 'Item', 'Class', 'Consumption', 'Value'] },
    { label: 'Vendor Performance', desc: 'Vendor delivery & quality', endpoint: '/reports/vendor-performance', bg: 'rgba(239,68,68,0.12)', icon: '<path d=\"M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"/><circle cx=\"8.5\" cy=\"7\" r=\"4\"/><polyline points=\"17 11 19 13 23 9\"/>', headers: ['Vendor', 'On Time %', 'Quality %', 'Rating'] },
    { label: 'Pick Efficiency', desc: 'Pick wave completion stats', endpoint: '/reports/pick-efficiency', bg: 'rgba(6,182,212,0.12)', icon: '<polygon points=\"13 2 3 14 12 14 11 22 21 10 12 10 13 2\"/>', headers: ['Wave#', 'Lines', 'Completed', 'Efficiency %'] },
    { label: 'Project Consumption', desc: 'Material consumption by project', endpoint: '/reports/project-consumption', bg: 'rgba(248,113,113,0.12)', icon: '<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><line x1=\"9\" y1=\"3\" x2=\"9\" y2=\"21\"/><line x1=\"15\" y1=\"3\" x2=\"15\" y2=\"21\"/>', headers: ['Project', 'SKU', 'Qty Consumed', 'Date'] },
    { label: 'Audit Trail', desc: 'System activity log', endpoint: '/reports/audit', bg: 'rgba(168,85,247,0.12)', icon: '<circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"12\" y1=\"16\" x2=\"12\" y2=\"12\"/><line x1=\"12\" y1=\"8\" x2=\"12.01\" y2=\"8\"/>', headers: ['Timestamp', 'User', 'Action', 'Entity', 'Details'] }
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {}

  getRowValue(row: any, h: string): string {
    return row[h.toLowerCase().replace(/\s/g, '')] || row[h.toLowerCase()] || '-';
  }

  selectReport(r: any): void {
    this.selectedReport = r;
    this.reportData = [];
    this.api.get<any[]>(r.endpoint).subscribe(d => this.reportData = d || []);
  }
}
