import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdleTimeoutComponent } from './idle-timeout.component';

describe('IdleTimeoutComponent', () => {
  let component: IdleTimeoutComponent;
  let fixture: ComponentFixture<IdleTimeoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdleTimeoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IdleTimeoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
