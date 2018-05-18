import {Component, TemplateRef, ViewChild} from '@angular/core';
import {addDays, addHours, endOfDay, endOfMonth, isSameDay, isSameMonth, startOfDay, subDays} from 'date-fns';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EventService} from "../../_services"
import {Event} from "../../_models";

import {Subject} from 'rxjs';
import {CalendarEvent, DAYS_OF_WEEK} from 'angular-calendar';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  green: {
    primary: '#86af49',
    secondary: '#e3eaa7'
  }
};

@Component({
  selector: 'calendar-component',
  templateUrl: 'calendar.component.html'
})
export class CalendarComponent {
  holidays_list = [
    ['Australian Holidays', 'en.australian#holiday@group.v.calendar.google.com'],
    ['Austrian Holidays', 'en.austrian#holiday@group.v.calendar.google.com'],
    ['Brazilian Holidays', 'en.brazilian#holiday@group.v.calendar.google.com'],
    ['Canadian Holidays', 'en.canadian#holiday@group.v.calendar.google.com'],
    ['China Holidays', 'en.china#holiday@group.v.calendar.google.com'],
    ['Christian Holidays', 'en.christian#holiday@group.v.calendar.google.com'],
    ['Danish Holidays', 'en.danish#holiday@group.v.calendar.google.com'],
    ['Dutch Holidays', 'en.dutch#holiday@group.v.calendar.google.com'],
    ['Finnish Holidays', 'en.finnish#holiday@group.v.calendar.google.com'],
    ['French Holidays', 'en.french#holiday@group.v.calendar.google.com'],
    ['German Holidays', 'en.german#holiday@group.v.calendar.google.com'],
    ['Greek Holidays', 'en.greek#holiday@group.v.calendar.google.com'],
    ['Hong Kong (C) Holidays', 'en.hong_kong_c#holiday@group.v.calendar.google.com'],
    ['Hong Kong Holidays', 'en.hong_kong#holiday@group.v.calendar.google.com'],
    ['Indian Holidays', 'en.indian#holiday@group.v.calendar.google.com'],
    ['Indonesian Holidays', 'en.indonesian#holiday@group.v.calendar.google.com'],
    ['Iranian Holidays', 'en.iranian#holiday@group.v.calendar.google.com'],
    ['Irish Holidays', 'en.irish#holiday@group.v.calendar.google.com'],
    ['Islamic Holidays', 'en.islamic#holiday@group.v.calendar.google.com'],
    ['Italian Holidays', 'en.italian#holiday@group.v.calendar.google.com'],
    ['Japanese Holidays', 'en.japanese#holiday@group.v.calendar.google.com'],
    ['Jewish Holidays', 'en.jewish#holiday@group.v.calendar.google.com'],
    ['Malaysian Holidays', 'en.malaysia#holiday@group.v.calendar.google.com'],
    ['Mexican Holidays', 'en.mexican#holiday@group.v.calendar.google.com'],
    ['New Zealand Holidays', 'en.new_zealand#holiday@group.v.calendar.google.com'],
    ['Norwegian Holidays', 'en.norwegian#holiday@group.v.calendar.google.com'],
    ['Philippines Holidays', 'en.philippines#holiday@group.v.calendar.google.com'],
    ['Polish Holidays', 'en.polish#holiday@group.v.calendar.google.com'],
    ['Portuguese Holidays', 'en.portuguese#holiday@group.v.calendar.google.com'],
    ['Russian Holidays', 'en.russian#holiday@group.v.calendar.google.com'],
    ['Singapore Holidays', 'en.singapore#holiday@group.v.calendar.google.com'],
    ['South Africa Holidays', 'en.sa#holiday@group.v.calendar.google.com'],
    ['South Korean Holidays', 'en.south_korea#holiday@group.v.calendar.google.com'],
    ['Spain Holidays', 'en.spain#holiday@group.v.calendar.google.com'],
    ['Swedish Holidays', 'en.swedish#holiday@group.v.calendar.google.com'],
    ['Taiwan Holidays', 'en.taiwan#holiday@group.v.calendar.google.com'],
    ['Thai Holidays', 'en.thai#holiday@group.v.calendar.google.com'],
    ['UK Holidays', 'en.uk#holiday@group.v.calendar.google.com'],
    ['Ukrainian Holidays', 'en.ukrainian#holiday@group.v.calendar.google.com'],
    ['US Holidays', 'en.usa#holiday@group.v.calendar.google.com']];

  selectedHoliday: string;

  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  viewDate = new Date();
  activeDayIsOpen: boolean = true;
  view: string = 'month';
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  events: Event[];
  nationalEvents: Event[];
  calendarEvents: CalendarEvent[] = [];
  refresh: Subject<any> = new Subject();

  constructor(private eventService: EventService,
              private modal: NgbModal) {
  }

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(): void {
    this.eventService.getEventsByCustId()
      .subscribe((events) => {
        this.events = events;
        for (let i = 0; i < events.length; i++) {
          console.log(this.events[i].visibility);
          console.log(this.events[i].startTime + ' ' + this.events[i].endTime)
          this.calendarEvents.push({
            title: this.events[i].name,
            start: new Date(this.events[i].startTime),
            end: new Date(this.events[i].endTime),
            color: this.events[i].visibility == "PUBLIC" ? colors.red : colors.blue
          })
        }
        this.refresh.next();
      });
  }


  showHolidays() {
    this.calendarEvents = this.calendarEvents.slice(0, this.events.length);
    this.refresh.next();
    console.log(this.selectedHoliday);
    this.eventService.getNationalEvents(this.selectedHoliday)
      .subscribe((events) => {
        this.nationalEvents = events;
        for (let i = 0; i < events.length; i++) {
          console.log(this.nationalEvents[i].visibility);
          console.log(this.nationalEvents[i].startTime + ' ' + this.nationalEvents[i].endTime);
          this.calendarEvents.push({
            title: this.nationalEvents[i].name,
            start: new Date(this.nationalEvents[i].startTime),
            end: new Date(this.nationalEvents[i].endTime),
            color: colors.green
          })
        }
        this.refresh.next();
      });
  }

}
