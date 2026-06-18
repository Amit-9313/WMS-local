import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../services/api.service';
import { Project, BOM, Stage } from '../../models';

import { ProjectFormComponent } from './project-form/project-form.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { StageTrackerComponent } from './stage-tracker/stage-tracker.component';
import { BomLineTableComponent } from './bom-line-table/bom-line-table.component';
import { BomImportComponent } from './bom-import/bom-import.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProjectFormComponent,
    ProjectListComponent,
    StageTrackerComponent,
    BomLineTableComponent,
    BomImportComponent
  ],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  activeTab = 'projects';
  showProjectForm = false;

  projects: any[] = [];
  stages: any[] = [];

  selectedProject: any = null;
  bom: any = null;

  constructor(private api: ApiService) { }

  ngOnInit(): void {

    // FRONTEND TEST DATA
    this.projects = [
      {
        projectId: 1,
        code: 'PRJ-001',
        name: 'Warehouse Automation',
        customer: 'ABC Industries',
        status: 'Active'
      },
      {
        projectId: 2,
        code: 'PRJ-002',
        name: 'Distribution Center',
        customer: 'XYZ Logistics',
        status: 'Planning'
      }
    ];

    this.stages = [
      {
        id: 1,
        projectId: 1,
        stageName: 'Procurement',
        status: 'Completed'
      },
      {
        id: 2,
        projectId: 1,
        stageName: 'Inventory',
        status: 'In Progress'
      },
      {
        id: 3,
        projectId: 1,
        stageName: 'Picking',
        status: 'Pending'
      }
    ];

    // Uncomment when backend is ready
    // this.loadProjects();
    // this.loadStages();
  }

  loadProjects(): void {
    this.api.get<Project[]>('/project')
      .subscribe({
        next: (res) => {
          console.log('Projects:', res);
          this.projects = res || [];
        },
        error: (err) => {
          console.error('Project API Error', err);
        }
      });
  }

  loadStages(): void {
    this.api.get<Stage[]>('/project/stages')
      .subscribe({
        next: (res) => {
          console.log('Stages:', res);
          this.stages = res || [];
        },
        error: (err) => {
          console.error('Stage API Error', err);
        }
      });
  }

  selectProject(project: any): void {

    this.selectedProject = project;
    this.activeTab = 'bom';

    // Mock BOM for frontend testing

    this.bom = {
      bomId: 1,
      projectId: project.projectId,
      lines: [
        {
          itemCode: 'ITEM-001',
          description: 'Industrial Sensor',
          quantity: 10,
          uom: 'Nos'
        },
        {
          itemCode: 'ITEM-002',
          description: 'Control Panel',
          quantity: 5,
          uom: 'Nos'
        }
      ]
    };

    // Uncomment when backend is ready
    /*
    this.api
      .get<BOM>('/project/' + project.projectId + '/bom')
      .subscribe({
        next: (res) => {
          this.bom = res || null;
        },
        error: (err) => {
          console.error('BOM API Error', err);
        }
      });
    */
  }

  importBOM(event: Event): void {

    if (!this.selectedProject) return;

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    console.log('Selected File:', input.files[0].name);

    // Uncomment when backend is ready

    /*
    const fd = new FormData();

    fd.append('file', input.files[0]);

    this.api.upload(
      '/project/' +
      this.selectedProject.projectId +
      '/bom/import',
      fd
    ).subscribe(() => {

      this.api
        .get<BOM>(
          '/project/' +
          this.selectedProject.projectId +
          '/bom'
        )
        .subscribe(res => {
          this.bom = res || null;
        });

    });
    */
  }
}
