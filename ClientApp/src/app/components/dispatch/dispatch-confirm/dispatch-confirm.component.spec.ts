import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchConfirmComponent } from './dispatch-confirm.component';

describe('DispatchConfirmComponent', () => {
  let component: DispatchConfirmComponent;
  let fixture: ComponentFixture<DispatchConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispatchConfirmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispatchConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
