import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserhomeglobalhistoryComponent } from './userhomeglobalhistory.component';

describe('UserhomeglobalhistoryComponent', () => {
  let component: UserhomeglobalhistoryComponent;
  let fixture: ComponentFixture<UserhomeglobalhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserhomeglobalhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserhomeglobalhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
