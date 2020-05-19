import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-track-calendar',
  templateUrl: './track-calendar.page.html',
  styleUrls: ['./track-calendar.page.scss'],
})
export class TrackCalendarPage implements OnInit {
  calendarPlugins = [dayGridPlugin]; // important!
  constructor() { }

  ngOnInit() {
  }

}
