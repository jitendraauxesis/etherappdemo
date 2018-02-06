import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserhomemodelComponent } from './userhomemodel.component';

describe('UserhomemodelComponent', () => {
  let component: UserhomemodelComponent;
  let fixture: ComponentFixture<UserhomemodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserhomemodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserhomemodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
