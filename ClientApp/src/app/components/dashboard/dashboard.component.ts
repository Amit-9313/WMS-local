import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Stock, Movement, Project } from '../../models';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  kpis: any[] = [];
  projects: Project[] = [];
  movements: Movement[] = [];

    // Demo data for dashboard template
   projectChartData = [
  { name: 'Metro', required: 95, available: 82 },
  { name: 'Airport', required: 78, available: 65 },
  { name: 'Mall', required: 88, available: 92 },
  { name: 'Tower-A', required: 70, available: 55 },
  { name: 'Hospital', required: 98, available: 74 }
];


  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    const [items, projs, moves, stock] = await Promise.all([
      this.api.get<any[]>('/item').toPromise(),
      this.api.get<Project[]>('/project').toPromise(),
      this.api.get<Movement[]>('/inventory/movements?limit=5').toPromise(),
      this.api.get<Stock[]>('/inventory').toPromise()
    ]);

    this.projects = (projs || []) as Project[];
      if (this.projects && this.projects.length > 0) {
        this.projectChartData = this.projects
          .slice(0, 5)
          .map((p, index) => ({
            name: p.projectName?.substring(0, 8) || `P${index + 1}`,
            required: Math.floor(Math.random() * 40) + 60,
            available: Math.floor(Math.random() * 50) + 30
          }));
      }
    this.movements = (moves || []) as Movement[];
    const itemCount = Array.isArray(items) ? items.length : 0;
    const projCount = Array.isArray(projs) ? projs.length : 0;

    this.kpis = [
      { label: 'Total Stock Value', value: '₹ 2,45,600', trend: '+12% vs last month', up: true, bg: 'rgba(14,165,233,0.12)', icon: '<circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"16\" y1=\"12\" x2=\"8\" y2=\"12\"/>' },
      { label: 'Active SKUs', value: String(itemCount), trend: 'Live ledger', up: true, bg: 'rgba(16,185,129,0.12)', icon: '<polyline points=\"22 12 18 12 15 21 9 3 6 12 2 12\"/>' },
      { label: 'Bin Utilization', value: '42.5%', trend: 'Avg active load', up: true, bg: 'rgba(139,92,246,0.12)', icon: '<rect x=\"3\" y=\"3\" width=\"7\" height=\"9\" rx=\"1\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"5\" rx=\"1\"/>' },
      { label: 'Active Projects', value: String(projCount), trend: 'Stages in progress', up: true, bg: 'rgba(245,158,11,0.12)', icon: '<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><line x1=\"9\" y1=\"3\" x2=\"9\" y2=\"21\"/><line x1=\"15\" y1=\"3\" x2=\"15\" y2=\"21\"/>' },
      { label: 'Pending Tasks', value: '12', trend: '3 overdue', up: false, bg: 'rgba(239,68,68,0.12)', icon: '<path d=\"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9\"/><path d=\"M13.73 21a2 2 0 0 1-3.46 0\"/>' },
      { label: 'Accuracy Rate', value: '98.2%', trend: '+0.5%', up: true, bg: 'rgba(6,182,212,0.12)', icon: '<circle cx=\"12\" cy=\"12\" r=\"10\"/><polyline points=\"12 6 12 12 16 14\"/>' }
    ];
  }
}