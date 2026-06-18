import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageTrackerComponent } from './stage-tracker.component';

describe('StageTrackerComponent', () => {
  let component: StageTrackerComponent;
  let fixture: ComponentFixture<StageTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StageTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StageTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
