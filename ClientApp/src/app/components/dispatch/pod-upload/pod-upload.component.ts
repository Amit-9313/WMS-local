import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pod-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pod-upload.component.html',
  styleUrls: ['./pod-upload.component.css']
})
export class PODUploadComponent {

  selectedFile: any;

  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
  }

  upload() {
    console.log('Upload POD', this.selectedFile);
  }
}
