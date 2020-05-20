import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HotPointsPage } from './hot-points.page';

describe('HotPointsPage', () => {
  let component: HotPointsPage;
  let fixture: ComponentFixture<HotPointsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotPointsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HotPointsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
