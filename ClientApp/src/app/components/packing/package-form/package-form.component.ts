import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-package-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './package-form.component.html',
  styleUrls: ['./package-form.component.css']
})
export class PackageFormComponent {

  @Output() save = new EventEmitter<any>();

  packageData: any = {
    project: '',
    stage: '',
    weight: 0,
    length: 0,
    width: 0,
    height: 0
  };

  create() {
    this.save.emit(this.packageData);
  }

}
