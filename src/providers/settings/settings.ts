import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
 
@Injectable()
export class SettingsProvider {
 
    public theme: BehaviorSubject<String>;
 
    constructor() {
        this.theme = new BehaviorSubject('argentina-theme');
    }
 
    setActiveTheme(val) {
        this.theme.next(val);
    }
 
    getActiveTheme() {
        return this.theme.asObservable();
    }

    getActiveThemeValue() {
        return this.theme.value;
    }
}
