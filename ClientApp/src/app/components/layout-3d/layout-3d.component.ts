import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-layout-3d',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './layout-3d.component.html',
  styleUrls: ['./layout-3d.component.css']
})
export class Layout3dComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  hoveredZone = '';
  tooltipX = 0;
  tooltipY = 0;
  zones: { name: string; x: number; y: number; w: number; h: number; color: string }[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.zones = [
      { name: 'Dock', x: 20, y: 280, w: 200, h: 120, color: '#38bdf8' },
      { name: 'Staging Area', x: 250, y: 280, w: 250, h: 120, color: '#f59e0b' },
      { name: 'Quarantine', x: 530, y: 280, w: 200, h: 120, color: '#ef4444' },
      { name: 'Storage A', x: 20, y: 20, w: 230, h: 120, color: '#10b981' },
      { name: 'Picking Area', x: 280, y: 20, w: 190, h: 120, color: '#6366f1' },
      { name: 'Storage B', x: 500, y: 20, w: 230, h: 120, color: '#10b981' },
    ];
  }

  ngAfterViewInit(): void {
    this.drawLayout();
  }

  drawLayout(): void {
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 750, 420);

    ctx.fillStyle = '#f5f7fa';
    ctx.fillRect(0, 0, 750, 420);

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 750; x += 40) { ctx.moveTo(x, 0); ctx.lineTo(x, 420); }
    for (let y = 0; y < 420; y += 40) { ctx.moveTo(0, y); ctx.lineTo(750, y); }
    ctx.stroke();

    const aisleZones = ['Dock', 'Staging Area', 'Storage A', 'Storage B', 'Picking Area', 'Quarantine'];
    this.zones.forEach(z => {
      ctx.fillStyle = z.color + '30';
      ctx.fillRect(z.x, z.y, z.w, z.h);
      ctx.strokeStyle = z.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(z.x, z.y, z.w, z.h);

      ctx.fillStyle = z.color;
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(z.name, z.x + z.w / 2, z.y + z.h / 2);
    });

    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText('U-Shape Layout — Usha Engineers', 10, 415);
  }

  onMouseMove(e: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let found = '';
    for (const z of this.zones) {
      if (mx >= z.x && mx <= z.x + z.w && my >= z.y && my <= z.y + z.h) {
        found = z.name;
        break;
      }
    }
    this.hoveredZone = found;
    this.tooltipX = mx + 12;
    this.tooltipY = my - 8;
  }
}
