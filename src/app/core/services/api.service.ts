import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FunctionService } from './function.service';
import { LocalStorageService } from './local-storage.service';
import { WebsocketService } from './websocket.service';

const PRICE_URL = 'wss://ws.coincap.io/prices';
const TRADES_URL = 'wss://ws.coincap.io/trades';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  //https://docs.coincap.io/#e1c56fd0-d57a-40dd-8a24-4b0883b58cfb
  public domain = 'https://api.coincap.io/v2';

  constructor(
    private http: HttpClient,
    private wsService: WebsocketService,
    private localStorageService: LocalStorageService,
    private functionService: FunctionService
  ) {}

  getMarkets(): Observable<any[]> {
    return this.http.get<any[]>(this.domain + '/markets');
  }

  getPriceByCrypto(cryptoName: string) {
    this.wsService
      .connect(`${PRICE_URL}?assets=${cryptoName}`)
      .subscribe((ret) => {
        if (ret) {
          let a = JSON.parse(ret.data);

          if (cryptoName === 'solana') {
            this.functionService.cryotoValueObservable(a[cryptoName]);
            this.localStorageService.setValueSol(a[cryptoName]);
          } else {
            this.functionService.cryotoTronValueObservable(a[cryptoName]);
            this.localStorageService.setValueTron(a[cryptoName]);
          }
        }
      });
  }

  getTracesByCrypto(exchange: string, cryptoName: string) {
    this.wsService.connect(`${TRADES_URL}/${exchange}`).subscribe((ret) => {
      if (ret) {
        let c = JSON.parse(ret.data);
        if (c.base === cryptoName) {
          console.log(c);
        }
      }
    });
  }

  getRates(): Observable<any[]> {
    return this.http.get<any[]>(this.domain + '/rates');
  }

  getRatesByCrypto(cryptoName: string): Observable<any[]> {
    return this.http.get<any[]>(this.domain + '/rates/' + cryptoName);
  }
}
