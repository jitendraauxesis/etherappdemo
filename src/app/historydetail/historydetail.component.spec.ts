import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorydetailComponent } from './historydetail.component';

describe('HistorydetailComponent', () => {
  let component: HistorydetailComponent;
  let fixture: ComponentFixture<HistorydetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorydetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorydetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
