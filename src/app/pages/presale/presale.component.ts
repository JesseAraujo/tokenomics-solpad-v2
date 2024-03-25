import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexPlotOptions,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { CURRENCY_MASK_CONFIG, CurrencyMaskModule } from 'ng2-currency-mask';
import { Subscription } from 'rxjs';
import { FunctionService } from 'src/app/core/services/function.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { Presale, Tokenomics } from 'src/app/model/presale';
import { OnlyNumbersDirective } from 'src/app/shared/directives/only-numbers.directive';
import { PopoverComponent } from 'src/app/shared/popover/popover.component';
import { CustomCurrencyMaskConfig } from 'src/main';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
  yaxis: ApexYAxis | ApexYAxis[];
  labels: string[];
  stroke: any; // ApexStroke;
  states: any;
  markers: ApexMarkers;
  fill: ApexFill;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-presale',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    OnlyNumbersDirective,
    CurrencyMaskModule,
    NgApexchartsModule,
    PopoverComponent,
  ],
  providers: [
    {
      provide: CURRENCY_MASK_CONFIG,
      useValue: CustomCurrencyMaskConfig,
    },
  ],
  templateUrl: './presale.component.html',
})
export class PresaleComponent implements OnInit, OnDestroy {
  presale: Presale = new Presale();
  tokenomics: Tokenomics = new Tokenomics();
  subscription: Subscription[] = [];
  solValueApi: number = 0.0;
  burned = 0;
  valueUnloked = 0;
  solValueTotal = 0;
  totalDollarsInLiquidity = 0;
  errorGetTotalUnloked = false;

  nameTokenomics: string;
  valueTokenomics: number;
  oldMcap: number;
  oldLprice: number;
  oldSolPricePerToken: number;

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @ViewChild('chartA') chartA: ChartComponent;
  public chartOptionsa: Partial<ChartOptions>;

  constructor(
    private functionService: FunctionService,
    private localStorageService: LocalStorageService
  ) {
    this.subscription.push(
      this.functionService.cryotoValue$.subscribe((ret) => {
        if (ret) {
          this.solValueApi = Number(ret);
          this.onCalcTotalDollarsInLiquidity();
        }
      })
    );
  }

  ngOnInit() {
    this.setListTokenomics();
    this.solValueApi = Number(this.localStorageService.getValueSol());
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((s) => s.unsubscribe());
    }
  }

  onCalcTotalTokensForPresale() {
    this.presale.TotalTokensForPresale =
      this.presale.PresalePrice * this.presale.Hardcap || 0;
    this.presale.SoftCap = (this.presale.Hardcap * 25) / 100 || 0;

    this.onCalcTotalTokensForLiquidity();
  }

  onCalcTotalTokensForLiquidity() {
    if (this.presale.TotalSupply) {
      if (
        this.presale.LiquidityPercentage &&
        this.presale.LiquidityPercentage < 15
      ) {
        alert(
          'Error: Liquidity Percent % - Allowed value greater than or equal to 15'
        );
        this.presale.LiquidityPercentage = 15;
        this.onCalcTotalTokensForLiquidity();
        return;
      }

      this.presale.TotalTokensForLiquidity =
        this.presale.Hardcap *
          0.95 *
          this.presale.ListingPrice *
          (this.presale.LiquidityPercentage / 100) || 0;

      this.presale.TokenFee =
        this.presale.PresalePrice * this.presale.Hardcap * 0.01 || 0;

      this.oldLprice = this.presale.ListingPrice;
      this.calcTotalTokensNeeded();
    }
  }

  calcTotalTokensNeeded() {
    this.presale.TotalTokensNeeded =
      1.02 * (this.presale.PresalePrice * this.presale.Hardcap) +
        (0.95 *
          (this.presale.ListingPrice * this.presale.Hardcap) *
          this.presale.LiquidityPercentage) /
          100 || 0;

    this.presale.TotalTokensNeededOnePercentageSolpad =
      this.presale.TotalTokensNeeded +
      this.presale.TotalTokensNeeded * (1 / 100);

    this.calcIsWork();
    this.calcTotalSol();
    this.setListTokenomics();
    this.onCalcTotalDollarsInLiquidity();
  }

  onCalcTokensForSolPad() {
    this.presale.TokensForSolPad =
      this.presale.TotalTokensNeededOnePercentageSolpad *
      ((this.presale.TransferFee + 1) / 100);
  }

  calcIsWork() {
    this.presale.IsWork =
      this.presale.TotalSupply - this.presale.TotalTokensNeeded;
    this.presale.YouWillUseHowManyTotalSupply =
      (this.presale.TotalTokensNeeded / this.presale.TotalSupply) * 100 || 0;
  }

  onCalcSolPricePerToken() {
    if (this.presale.ListingPrice > 0) {
      this.presale.SolPricePerToken =
        this.presale.ListingPrice / this.solValueApi;

      this.oldSolPricePerToken = this.presale.SolPricePerToken;
    }
  }

  calcTotalSol() {
    this.presale.TotalSolOwnerWallet =
      this.presale.Hardcap *
        (1 - this.presale.LiquidityPercentage / 100) *
        0.95 || 0;
    this.presale.TotalSolForLiquidity =
      this.presale.Hardcap * (this.presale.LiquidityPercentage / 100) * 0.95 ||
      0;
  }

  setListTokenomics() {
    let unlocked = 100 - this.presale.YouWillUseHowManyTotalSupply;
    let presale =
      (this.presale.TotalTokensForPresale / this.presale.TotalSupply) * 100 ||
      0.0;
    let liquidity =
      this.presale.YouWillUseHowManyTotalSupply -
        (this.presale.TotalTokensForPresale / this.presale.TotalSupply) * 100 ||
      0.0;

    if (
      !this.presale.ListTokenomics ||
      this.presale.ListTokenomics.length === 0
    ) {
      this.presale.ListTokenomics = [
        {
          Name: 'PreSale',
          Value: presale,
          IsEditable: false,
          Color: '#fd728f',
        },
        {
          Name: 'Liquidity',
          Value: liquidity,
          IsEditable: false,
          Color: '#039bfe',
        },
        {
          Name: 'Burned',
          Value: this.burned,
          IsEditable: true,
          Color: '#94a2af',
        },
        {
          Name: 'Unlocked',
          Value: unlocked,
          IsEditable: false,
          Color: '#ffcc56',
        },
      ];
    } else {
      this.presale.ListTokenomics.filter((n) => n.Name === 'PreSale').map(
        (element) => {
          element.Value = presale;
        }
      );

      this.presale.ListTokenomics.filter((n) => n.Name === 'Liquidity').map(
        (element) => {
          element.Value = liquidity;
        }
      );

      this.presale.ListTokenomics.filter((n) => n.Name === 'Unlocked').map(
        (element) => {
          element.Value = this.onGetTotalUnloked();
        }
      );
    }

    this.valueUnloked = 100 - this.presale.YouWillUseHowManyTotalSupply;

    this.onCalcSolInToken(this.presale.ListTokenomics);
    this.a();
  }

  onGetTotalUnloked(): any {
    let total = 0;
    let totalUnloked = 0;

    this.presale.ListTokenomics.forEach((element) => {
      if (element.Name !== 'Unlocked') {
        total = total + element.Value;
        totalUnloked = 100 - total;
      }
    });

    if (totalUnloked < 0 && !this.errorGetTotalUnloked) {
      this.errorGetTotalUnloked = true;
      this.presale.ListTokenomics[2].Value = 0;
      let message =
        'Error: Informed value exceeds total allowed. There is only ' +
        this.valueUnloked.toFixed(2) +
        '% available to distribute';
      alert(message);

      this.presale.PresalePrice = 0;
      this.presale.ListingPrice = 0;
      return this.onGetTotalUnloked();
    } else {
      this.errorGetTotalUnloked = false;
      this.valueUnloked = totalUnloked;
      return totalUnloked;
    }
  }

  onCalcTotalDollarsInLiquidity() {
    if (
      this.solValueApi > 0 &&
      this.presale.TotalSupply > 0 &&
      this.presale.TotalTokensForLiquidity > 0
    ) {
      this.solValueTotal = 1;
      this.totalDollarsInLiquidity =
        this.presale.TotalSolForLiquidity * this.solValueApi;

      this.onCalcMcap();
      this.onCalcSolPricePerToken();
    }
  }

  onCalcMcap() {
    let totalSupplyForMacp =
      this.presale.TotalSupply - this.presale.TotalSupply * (this.burned / 100);
    this.presale.Mcap =
      (this.totalDollarsInLiquidity / this.presale.TotalTokensForLiquidity) *
      totalSupplyForMacp;

    this.oldMcap = this.presale.Mcap;
  }

  onCalcChangeMcap() {
    this.presale.ListingPrice =
      (this.oldLprice / this.presale.Mcap) * this.oldMcap;

    this.presale.PresalePrice = this.presale.ListingPrice;

    this.onCalcTotalTokensForPresale();
  }

  onCalcChangePriceAtLaunch() {
    this.presale.ListingPrice =
      (this.oldLprice / this.presale.SolPricePerToken) *
      this.oldSolPricePerToken;

    this.presale.PresalePrice = this.presale.ListingPrice;

    this.onCalcTotalTokensForPresale();
  }

  onGetValueBurned() {
    return this.presale.ListTokenomics.filter((n) => n.Name === 'Burned')[0]
      .Value;
  }

  onCalcSolInToken(listTokenomics: Tokenomics[]) {
    let valueSolInToken = this.presale.ListingPrice || 0;
    let quantitySol =
      valueSolInToken === 0 ? 0 : this.presale.TotalSupply / valueSolInToken;

    listTokenomics.forEach((element) => {
      if (quantitySol > 0) {
        element.Sol = quantitySol * (element.Value / 100);
      } else {
        element.Sol = 0;
      }
    });
  }

  formatNumber(a: any) {
    return a.replace(/,/g, ' ');
  }

  onSetNewTokenomicsClick(nameTokenomics: string, valueTokenomics: number) {
    if (valueTokenomics <= this.valueUnloked) {
      this.presale.ListTokenomics.push({
        Name: nameTokenomics,
        Value: valueTokenomics,
        IsEditable: true,
        Color: this.onGenerateColor(),
      });

      this.presale.ListTokenomics.filter((n) => n.Name === 'Unlocked').map(
        (element) => {
          element.Value = this.onGetTotalUnloked();
        }
      );

      this.nameTokenomics = '';
      this.valueTokenomics = 0;

      this.a();
      this.onCalcSolInToken(this.presale.ListTokenomics);
    } else {
      let message =
        'Error: Informed value exceeds total allowed. There is only ' +
        this.valueUnloked.toFixed(2) +
        '% available to distribute';
      alert(message);
      this.valueTokenomics = 0;
      return;
    }
  }

  onSetValueBlur(tokenomics: Tokenomics, value: number) {
    tokenomics.Value = value || 0;

    this.presale.ListTokenomics.filter((n) => n.Name === 'Unlocked').map(
      (element) => {
        element.Value = this.onGetTotalUnloked();
      }
    );

    this.burned = this.onGetValueBurned();

    this.a();
    this.onCalcSolInToken(this.presale.ListTokenomics);
    this.onCalcTotalDollarsInLiquidity();
  }

  onGenerateColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }

  a() {
    let value: number[] = [];
    let color: string[] = [];
    let name: string[] = [];

    this.presale.ListTokenomics.forEach((ret) => {
      value.push(ret.Value);
      color.push(ret.Color);
      name.push(ret.Name);
    });

    this.chartCreate(value, color, name);
  }

  chartCreate(value: any, color: any, name: any) {
    this.chartOptions = {
      series: value,
      chart: {
        width: 380,
        type: 'donut',
      },
      tooltip: {
        fillSeriesColor: false,
      },
      stroke: {
        width: 0,
      },
      plotOptions: {
        pie: {
          expandOnClick: false,
        },
      },
      states: {
        active: {
          filter: {
            type: 'none',
          },
        },
        hover: {
          filter: {
            type: 'none',
          },
        },
      },
      labels: name,
      colors: color,
      legend: {
        show: false,
      },
    };
  }
}
