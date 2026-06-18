import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-package-assignment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './package-assignment.component.html',
  styleUrls: ['./package-assignment.component.css']
})
export class PackageAssignmentComponent {

  @Input() packages: any[] = [];

  get totalWeight(): number {
    return this.packages
      .filter(x => x.selected)
      .reduce((a, b) => a + (b.weight || 0), 0);
  }

  get totalPackages(): number {
    return this.packages.filter(x => x.selected).length;
  }
}
