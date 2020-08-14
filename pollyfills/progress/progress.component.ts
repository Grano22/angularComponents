import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';

export class ProgressBarTask {
    startTime: number;
    elapsedTime: number;

    private currentTime: number;
    private context: ProgressBarComponent = null;

    start() {
        if(this.context) this.animate();
    }

    onContextReady(newContext: ProgressBarComponent) { this.context = newContext; }

    animate() {
        this.context.value = Math.floor((this.currentTime / this.elapsedTime) * 100);
        this.context.max = this.elapsedTime;
    }

    animateInterval() {
        
    }
}

@Component({
    selector: 'output-progress',
    templateUrl: './progress.component.html',
    styleUrls: ['./progress.component.less']
})
export class ProgressBarComponent implements OnInit {
    @Input() max: number = 1;
    @Input() set value(newVal: number) {
        this._value = newVal;
    }
    get value() {return this._value;}
    _value: number = 0;

    @Input() set onAnimate (animTask: ProgressBarTask) {
        if(animTask!=null) {
            animTask.onContextReady(this);
        }
    }
    ngOnChange() {

    }

    //Events
    @Output() onFinish: EventEmitter<number> = new EventEmitter<number>();
    @Output() onAbord: EventEmitter<number> = new EventEmitter<number>();

    getCompatibility() {return typeof HTMLProgressElement != 'undefined'}
    
    constructor(private _currEl: ElementRef) {

    }

    ngOnInit(): void {

    }

    removeAllElementStateClasses() {
        let thisEl = this._currEl.nativeElement as HTMLElement;
        for(let indName of ["aborded", "completed"]) if(!thisEl.classList.contains(indName)) thisEl.classList.remove(indName);
    }

    onCompleteEvent(): void {
        let thisEl = this._currEl.nativeElement as HTMLElement;
        this.removeAllElementStateClasses();
        thisEl.classList.add("complete");
        this.onAbord.emit();
    }

    onAbordEvent(): void {
        let thisEl = this._currEl.nativeElement as HTMLElement;
        this.removeAllElementStateClasses();
        thisEl.classList.add("aborded");
        this.onFinish.emit();
    }

    ngOnDestroy(): void {

    }
}