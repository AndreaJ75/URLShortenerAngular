import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlPasswordComponent } from './url-password.component';

describe('UrlPasswordComponent', () => {
  let component: UrlPasswordComponent;
  let fixture: ComponentFixture<UrlPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrlPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
