import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmpasswordPageComponent } from './confirmpassword-page.component';

describe('ConfirmpasswordPageComponent', () => {
  let component: ConfirmpasswordPageComponent;
  let fixture: ComponentFixture<ConfirmpasswordPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmpasswordPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmpasswordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
