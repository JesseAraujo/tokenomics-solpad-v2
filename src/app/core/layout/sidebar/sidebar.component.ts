import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { FunctionService } from '../../services/function.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit, OnDestroy {
  solValueApi: number = 0.0;
  subscription: Subscription[] = [];

  constructor(
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
  }

  ngOnInit() {
    this.solValueApi = Number(this.localStorageService.getValueSol());
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((s) => s.unsubscribe());
    }
  }
}
