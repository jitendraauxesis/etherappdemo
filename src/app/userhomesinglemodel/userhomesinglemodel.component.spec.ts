import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserhomesinglemodelComponent } from './userhomesinglemodel.component';

describe('UserhomesinglemodelComponent', () => {
  let component: UserhomesinglemodelComponent;
  let fixture: ComponentFixture<UserhomesinglemodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserhomesinglemodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserhomesinglemodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
