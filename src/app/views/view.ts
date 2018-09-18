import { OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Injector } from '@angular/core';
import { ToasterService } from 'angular2-toaster/src/toaster.service';

export abstract class View implements OnInit, OnDestroy, AfterViewInit {
    public Array = Array;
    public Math = Math;

    constructor(protected injector: Injector) {

    }

    public ngOnInit() {
    }

    public ngAfterViewInit() {

    }

    public ngOnDestroy() {
    }

    public navigate(path: string) {
        this.injector.get(Router).navigate([path], { relativeTo: this.injector.get(ActivatedRoute) });
    }

    public setSessionStorage(key: string, value: any) {
        sessionStorage.setItem(key, value);
    }

    public getSessionStorage<T>(key: string, defaultValue: T): T {
        const value = sessionStorage.getItem(key);
        return ((value) ? value : defaultValue) as T;
    }

    public errorMessage(title: string, message?: string) {
        this.injector.get(ToasterService).pop('error', title, message);
    }

    public successMessage(title: string, message?: string) {
        this.injector.get(ToasterService).pop('success', title, message);
    }

    public alert(message: string) {
        alert(message);
    }

    public getEnumValues(enumType: any): Array<number> {
        return Object.keys(enumType).filter((type) => !isNaN(<any>type) && type !== 'values').map<number>((value, index, array) => Number(value));
    }
}
