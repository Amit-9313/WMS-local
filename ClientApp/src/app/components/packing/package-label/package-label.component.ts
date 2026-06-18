import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-package-label',
  standalone: true,
  imports: [
    CommonModule,
    NgxBarcode6Module,
    QRCodeModule
  ],
  templateUrl: './package-label.component.html',
  styleUrls: ['./package-label.component.css']
})
export class PackageLabelComponent {

  @Input() packageNumber = 'PKG-001';

}
