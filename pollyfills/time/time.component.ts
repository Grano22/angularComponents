import { Component, OnInit, forwardRef, Input, ViewChild } from '@angular/core';
import { ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, Form, DefaultValueAccessor, ControlContainer, FormGroup, FormBuilder } from '@angular/forms';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'a-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.less'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TimeComponent), multi: true }
  ]
})
export class TimeComponent implements OnInit {


  public _value: any = {};
  disabled: boolean = false;

  displaySelector: boolean = false;
  mainInputObserver: ReplaySubject<string> = new ReplaySubject<string>();

  currHour: number = 0;
  currMinutes: number = 0;

  constructor(public controlContainer: ControlContainer, private formBuilder: FormBuilder) {
   
  }

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

  ngOnInit(): void {
    this.mainInputObserver.subscribe((newval: string)=>{
      this.value = newval;
    });
  }

  ngOnDestroy(): void {
    this.mainInputObserver.unsubscribe();
  }

  onFocus(): void {this.displaySelector = true;}

  onSelectorClose(evt: Event) { evt.stopPropagation(); let el = evt.target as HTMLElement; el.blur(); this.displaySelector = false; }

  updateValue(hours: number = -1, minutes: number = -1) {
    if(hours==-1) hours = this.currHour;
    if(minutes==-1) minutes = this.currMinutes;
    this.mainInputObserver.next((hours+'').padStart(2, '0')+':'+(minutes+'').padStart(2, '0'));
  }

  setThisTime() {
    this.currHour = new Date().getHours();
    this.currMinutes = new Date().getMinutes();
    this.updateValue();
  }

  onHoursTimeUpdate(hours: number = 0) {
    if(hours>23) hours = 0; else if(hours<0) hours = 23;
    this.currHour = hours;
    this.updateValue();
  }

  onMinutesTimeUpdate(minutes: number = 0) {
    if(minutes>59) minutes = 0; else if (minutes<0) minutes = 59;
    this.currMinutes = minutes;
    this.updateValue();
  }


}
