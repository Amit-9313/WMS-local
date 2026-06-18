import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStatusBadgeComponent } from './project-status-badge.component';

describe('ProjectStatusBadgeComponent', () => {
  let component: ProjectStatusBadgeComponent;
  let fixture: ComponentFixture<ProjectStatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectStatusBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectStatusBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
