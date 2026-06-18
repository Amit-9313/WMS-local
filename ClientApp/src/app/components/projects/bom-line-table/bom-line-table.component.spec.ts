import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BomLineTableComponent } from './bom-line-table.component';

describe('BomLineTableComponent', () => {
  let component: BomLineTableComponent;
  let fixture: ComponentFixture<BomLineTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BomLineTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BomLineTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
