import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './core/services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent {
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getPricesByCrypto('solana');
  }
}
