import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserhomecsvdetailComponent } from './userhomecsvdetail.component';

describe('UserhomecsvdetailComponent', () => {
  let component: UserhomecsvdetailComponent;
  let fixture: ComponentFixture<UserhomecsvdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserhomecsvdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserhomecsvdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
