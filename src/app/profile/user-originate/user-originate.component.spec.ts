import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOriginateComponent } from './user-originate.component';

describe('UserOriginateComponent', () => {
  let component: UserOriginateComponent;
  let fixture: ComponentFixture<UserOriginateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserOriginateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOriginateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
