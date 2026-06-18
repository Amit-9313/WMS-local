import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-picking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './picking.component.html',
  styleUrls: ['./picking.component.css']
})
export class PickingComponent implements OnInit {

  activeTab = 'waves';
  showWaveForm = false;

  waves: any[] = [];
  tasks: any[] = [];
  projects: any[] = [];

  selectedWave: any = null;

  waveForm = {
    waveType: 'Project',
    projectId: '',
    stageCode: '',
    autoRouteOptimized: false
  };

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.loadProjects();
    this.loadWaves();
    this.loadTasks();
  }

  loadProjects(): void {
    this.api
      .get<any[]>('/project')
      .subscribe(res => this.projects = res || []);
  }

  loadWaves(): void {
    this.api
      .get<any[]>('/pick/waves')
      .subscribe(res => this.waves = res || []);
  }

  loadTasks(): void {

    let url = '/pick/tasks';

    if (this.selectedWave?.waveId) {
      url += '?waveId=' + this.selectedWave.waveId;
    }

    this.api
      .get<any[]>(url)
      .subscribe(res => this.tasks = res || []);
  }

  viewWaveTasks(wave: any): void {

    this.selectedWave = wave;

    this.activeTab = 'tasks';

    this.loadTasks();
  }

  createWave(): void {

    this.api
      .post('/pick/waves', this.waveForm)
      .subscribe(() => {

        this.loadWaves();

        this.showWaveForm = false;

        this.waveForm = {
          waveType: 'Project',
          projectId: '',
          stageCode: '',
          autoRouteOptimized: false
        };

      });
  }

  confirmTask(task: any): void {

    this.api
      .put('/pick/tasks/' + task.pickTaskId + '/confirm', {})
      .subscribe(() => {

        this.loadTasks();

      });
  }

  getWaveStatusClass(status: string): string {

    switch (status) {

      case 'Completed':
        return 'badge-success';

      case 'In Progress':
        return 'badge-primary';

      case 'Short':
        return 'badge-danger';

      default:
        return 'badge-warning';
    }
  }

  getTaskStatusClass(status: string): string {

    switch (status) {

      case 'Completed':
        return 'badge-success';

      case 'In Progress':
        return 'badge-primary';

      case 'Short':
        return 'badge-danger';

      case 'Exception':
        return 'badge-danger';

      default:
        return 'badge-warning';
    }
  }

  get completedTasks(): number {

    return this.tasks.filter(
      x => x.status === 'Completed'
    ).length;
  }

  get shortTasks(): number {

    return this.tasks.filter(
      x => x.status === 'Short'
    ).length;
  }

}
