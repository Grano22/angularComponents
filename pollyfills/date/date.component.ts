import { Component, OnInit, ElementRef, Output, EventEmitter, forwardRef, HostBinding, OnChanges, Input } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ControlContainer, FormGroup, FormControl } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
const weekMap = {
    pl:["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"],
    en:["Monday", "Thuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    de:["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]
};
const monthMap = {
    pl:["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
    en:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    de:["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
}

export interface DateEvent {
    date: string;
    time: string;
    color: string;
    context: string;
}
@Component({
    selector: 'input-date',
    templateUrl: './date.component.html',
    styleUrls: ['./date.component.less'],
    providers: [
      { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateComponent), multi: true }
    ]
})
export class DateComponent implements OnInit, ControlValueAccessor {
    //Input
    @Input() defaultLang: string = null;

    public _value: any = {};
    disabled: boolean = false;
  
    controlLanguage: string = "pl";
    displaySelector: boolean = false;

    currMonth: number = new Date().getMonth();
    currYear: number = new Date().getFullYear();
    currDay: number = new Date().getDate();

    mainInputObserver: ReplaySubject<string> = new ReplaySubject<string>();

    lastSelectedTD: HTMLTableDataCellElement = null;

    monthMap: Array<any> = new Array<any>();

    set value(val) {
        if(val) {
            this._value = val;
            this.onChange(this._value);
        }
    }
    get value() {
        return this._value;
    }
  
    onChanged: any = () => {}
    onTouched: any = () => {}
  
    onChange(val) {
  
    }
    onTouch(val) {
  
    }
    writeValue(value: any){ 
    this.value = value
    }
    registerOnChange(fn: any){
    this.onChange = fn
    }
    registerOnTouched(fn: any){
    this.onTouch = fn
    }
    
    constructor() {

    }

    //Angular states
    ngOnInit(): void {
        if(this.defaultLang) this.controlLanguage = this.defaultLang;
        this.updateMonthMap();
        this.mainInputObserver.subscribe((newval: string)=>{
          this.value = newval;
        });
    }

    ngOnDestroy(): void {
        this.mainInputObserver.unsubscribe();
    }

    prepareValue(inpt: any) {return parseInt((inpt+"").replace(/\D+/g, ""));}

    updateValue(year: number = -1, month: number = -1, day: number = -1) {
        if(year==-1) year = this.currYear;
        if(month==-1) month = this.currMonth;
        if(day==-1) day = this.currDay;
        this.mainInputObserver.next(year+'-'+((month+1)+'').padStart(2, '0')+'-'+(day+'').padStart(2, '0'));
    }

    setToday() {
        this.currMonth= new Date().getMonth();
        this.currYear = new Date().getFullYear();
        this.currDay = new Date().getDate();
        this.updateValue();
    }

    translateWeek(weekNum: number) {return weekMap[this.controlLanguage][weekNum];}
    translateMonth(monthNum: number) {return monthMap[this.controlLanguage][monthNum];}
    get monthName() {return this.translateMonth(this.currMonth);}

    onFocus(): void {this.displaySelector = true;}
    onSelectorClose(evt: Event) { evt.stopPropagation(); let el = evt.target as HTMLElement; el.blur(); this.displaySelector = false; }

    onSelectorMonthUpdate(year: number = 0, month: number = 0) {
        let contextDate = new Date(year, month);
        this.currYear = contextDate.getFullYear();
        this.currMonth = contextDate.getMonth();
        this.updateMonthMap();
    }

    onSelectorDay(event: Event) {
        let el = event.target as HTMLTableDataCellElement;
        if(this.lastSelectedTD!=null && this.lastSelectedTD!=el) this.lastSelectedTD.classList.remove('selected');
        el.classList.toggle('selected');
        let elParams = el.id.split("-");
        if(this.currMonth==parseInt(elParams[0])) this.currDay = parseInt(elParams[1]);
        console.log(elParams[0]);
        //if(this.currMonth!=parseInt(elParams[0])) this.currMonth = parseInt(elParams[0]);
        this.lastSelectedTD = el;
        this.updateValue(this.currYear, parseInt(elParams[0]), parseInt(elParams[1]));
    }

    updateMonthMap() { this.monthMap = this.generateCalendarForMonth(this.currYear, this.currMonth); }

    generateCalendarForMonth(year: number, month: number, showToday: boolean = true, eventsMap: Array<DateEvent> = null) {
        let monthsArr: Array<any> = new Array<any>(), contextDate = new Date(year, month), today = new Date();
        let arrCounter: number = 0;
        let numOfMonth: number = new Date(year, month+1, 0).getDate();
        let numOfPreviousMonth: number = new Date(year, month, 0).getDate();
        let numOfWeekPreviousMonth: number=  new Date(year, month, 0).getDay();
        let numFirstDayOfWeek: number = new Date(year, month, 1).getDay();
        //let numOfWeek: number = contextDate.getDay();
        let daysInBackupBefore: number = 0;
        let showTodayPrepared = showToday && contextDate.getFullYear()==today.getFullYear() && contextDate.getMonth()==today.getMonth();
        monthsArr[0] = [];
        if(numFirstDayOfWeek!=1) {
          daysInBackupBefore = numOfWeekPreviousMonth;
          let readyVal = numOfPreviousMonth-daysInBackupBefore;
          for(let i = readyVal;i<numOfPreviousMonth;i++) monthsArr[0].push(i+1);
        }
        let totalCounter: number = 1;
        for(let i = numFirstDayOfWeek;i<=7;i++) {
          if(showTodayPrepared && totalCounter==today.getDate()) monthsArr[arrCounter].push("&"+totalCounter); else monthsArr[arrCounter].push(totalCounter);
          totalCounter++;
          if(totalCounter<=numOfMonth) { if(/*i>=7*/ monthsArr[arrCounter].length>=7) { i = 0; arrCounter++; monthsArr[arrCounter] = []; } } else break;
        }
        let numOfWeekLastDay: number = new Date(year, month+1, 0).getDay();
        if(numOfWeekLastDay!=0) {
          numOfWeekLastDay = 7 - numOfWeekLastDay;
          for(let i = 0;i<numOfWeekLastDay;i++) { monthsArr[arrCounter].push(i+1); }
        }
        return monthsArr;
    }
}