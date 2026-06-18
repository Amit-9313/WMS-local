import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCompletionBarComponent } from './project-completion-bar.component';

describe('ProjectCompletionBarComponent', () => {
  let component: ProjectCompletionBarComponent;
  let fixture: ComponentFixture<ProjectCompletionBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCompletionBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectCompletionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
