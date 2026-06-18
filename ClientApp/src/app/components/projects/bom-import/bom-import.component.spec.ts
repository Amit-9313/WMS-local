import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BomImportComponent } from './bom-import.component';

describe('BomImportComponent', () => {
  let component: BomImportComponent;
  let fixture: ComponentFixture<BomImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BomImportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BomImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
