import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  value_sol = 'value_sol';

  constructor() {}

  set(name: any, value: any) {
    localStorage.setItem(name, value);
  }

  get(name: any) {
    localStorage.getItem(name);
  }

  remove(name: any) {
    localStorage.removeItem(name);
  }

  setValueSol(value: any) {
    this.set('value_sol', value);
  }

  getValueSol() {
    return localStorage.getItem('value_sol');
  }
}
