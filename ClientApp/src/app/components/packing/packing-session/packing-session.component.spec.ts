import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingSessionComponent } from './packing-session.component';

describe('PackingSessionComponent', () => {
  let component: PackingSessionComponent;
  let fixture: ComponentFixture<PackingSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackingSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackingSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
