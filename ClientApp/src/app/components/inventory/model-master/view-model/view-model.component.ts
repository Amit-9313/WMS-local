import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelService, Model } from '../../../../services/model-master.service';

@Component({
  selector: 'app-view-model',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-model.component.html',
  styleUrls: ['./view-model.component.css']
})
export class ViewModelComponent implements OnInit {

  model?: Model;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modelService: ModelService
  ) { }

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.model =
      this.modelService.getModelById(id);
  }

  back(): void {

    this.router.navigate([
      '/model-master'
    ]);
  }
}
