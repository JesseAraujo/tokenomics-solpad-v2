import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  value_sol = 'value_sol';
  value_tron = 'value_tron';

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
    this.set(this.value_sol, value);
  }

  getValueSol() {
    return localStorage.getItem(this.value_sol);
  }

  setValueTron(value: any) {
    this.set(this.value_tron, value);
  }

  getValueTron() {
    return localStorage.getItem(this.value_tron);
  }
}
