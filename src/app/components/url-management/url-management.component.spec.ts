import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlManagementComponent } from './url-management.component';

describe('UrlManagementComponent', () => {
  let component: UrlManagementComponent;
  let fixture: ComponentFixture<UrlManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrlManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
