import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-package-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.css']
})
export class PackageListComponent {

  @Input() packages: any[] = [];

  @Output() print = new EventEmitter<any>();
  @Output() seal = new EventEmitter<any>();

}
