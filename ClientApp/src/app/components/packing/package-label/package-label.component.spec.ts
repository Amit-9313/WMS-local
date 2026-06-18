import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageLabelComponent } from './package-label.component';

describe('PackageLabelComponent', () => {
  let component: PackageLabelComponent;
  let fixture: ComponentFixture<PackageLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageLabelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
