import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserhomeglobalhistorylogsComponent } from './userhomeglobalhistorylogs.component';

describe('UserhomeglobalhistorylogsComponent', () => {
  let component: UserhomeglobalhistorylogsComponent;
  let fixture: ComponentFixture<UserhomeglobalhistorylogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserhomeglobalhistorylogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserhomeglobalhistorylogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
