import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlUpdateComponent } from './url-update.component';

describe('UrlUpdateComponent', () => {
  let component: UrlUpdateComponent;
  let fixture: ComponentFixture<UrlUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrlUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
