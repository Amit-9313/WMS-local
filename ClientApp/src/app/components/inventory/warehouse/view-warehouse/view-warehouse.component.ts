import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { WarehouseService, Warehouse } from '../../../../services/warehouse.service';

@Component({
  selector: 'app-view-warehouse',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-warehouse.component.html',
  styleUrls: ['./view-warehouse.component.css']
})
export class ViewWarehouseComponent implements OnInit {

  warehouse?: Warehouse;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private warehouseService: WarehouseService
  ) { }

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.warehouse =
      this.warehouseService
        .getWarehouseById(id);

  }

  back(): void {
    this.router.navigate(['/warehouse']);
  }
}
