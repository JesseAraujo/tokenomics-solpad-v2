import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  value_sol = 'value-sol';
  value_tron = 'value-tron';
  cripto_name = 'cripto-name';

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

  removeValueSol() {
    this.remove(this.value_sol);
  }

  setValueTron(value: any) {
    this.set(this.value_tron, value);
  }

  getValueTron() {
    return localStorage.getItem(this.value_tron);
  }

  removeValueTron() {
    this.remove(this.value_tron);
  }

  setCriptoName(value: any) {
    this.set(this.cripto_name, value);
  }

  getCriptoName() {
    return localStorage.getItem(this.cripto_name);
  }

  removeCriptoName() {
    this.remove(this.cripto_name);
  }
}
