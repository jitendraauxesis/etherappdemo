import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingdialogComponent } from './settingdialog.component';

describe('SettingdialogComponent', () => {
  let component: SettingdialogComponent;
  let fixture: ComponentFixture<SettingdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
