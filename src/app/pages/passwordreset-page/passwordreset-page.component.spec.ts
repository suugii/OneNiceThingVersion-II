import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordresetPageComponent } from './passwordreset-page.component';

describe('PasswordresetPageComponent', () => {
  let component: PasswordresetPageComponent;
  let fixture: ComponentFixture<PasswordresetPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordresetPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordresetPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
