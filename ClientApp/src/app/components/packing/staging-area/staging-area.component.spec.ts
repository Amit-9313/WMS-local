import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StagingAreaComponent } from './staging-area.component';

describe('StagingAreaComponent', () => {
  let component: StagingAreaComponent;
  let fixture: ComponentFixture<StagingAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StagingAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StagingAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
