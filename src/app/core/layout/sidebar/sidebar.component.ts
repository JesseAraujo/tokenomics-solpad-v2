import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { FunctionService } from '../../services/function.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit, OnDestroy {
  solValueApi: number = 0.0;
  tronValueApi: number = 0.0;
  bnbValueApi: number = 0.0;
  subscription: Subscription[] = [];
  coinName: string = 'solana';

  constructor(
    private apiService: ApiService,
    private functionService: FunctionService,
    private localStorageService: LocalStorageService
  ) {
    this.subscription.push(
      this.functionService.cryotoValue$.subscribe((ret) => {
        if (ret) {
          this.solValueApi = Number(ret);
        }
      })
    );

    this.subscription.push(
      this.functionService.cryotoTronValue$.subscribe((ret) => {
        if (ret) {
          this.tronValueApi = Number(ret);
        }
      })
    );

    this.subscription.push(
      this.functionService.cryotoBnbValue$.subscribe((ret) => {
        if (ret) {
          this.bnbValueApi = Number(ret);
        }
      })
    );

    this.subscription.push(
      this.functionService.cryotoName$.subscribe((ret) => {
        if (ret) {
          this.coinName = String(ret);
        }
      })
    );
  }

  ngOnInit() {
    this.solValueApi = Number(this.localStorageService.getValueSol());
    this.tronValueApi = Number(this.localStorageService.getValueTron());
    this.bnbValueApi = Number(this.localStorageService.getValueBnb());

    this.onSetValueCoin(this.coinName);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((s) => s.unsubscribe());
    }
  }

  onSetValueCoin(coinName: string) {
    this.coinName = coinName;
    this.apiService.getPriceByCrypto(coinName);
    this.localStorageService.setCriptoName(coinName);
    this.functionService.cryotoNameObservable(coinName);
  }
}
