import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeviceListPage } from './device-list.page';

describe('DeviceListPage', () => {
  let component: DeviceListPage;
  let fixture: ComponentFixture<DeviceListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
