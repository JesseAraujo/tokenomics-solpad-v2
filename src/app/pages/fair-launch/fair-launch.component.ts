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
import { FairLaunch, Tokenomics } from 'src/app/model/fair-launch';
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
  selector: 'app-fair-launch',
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
  templateUrl: './fair-launch.component.html',
})
export class FairLaunchComponent implements OnInit, OnDestroy {
  fairLaunch: FairLaunch = new FairLaunch();
  tokenomics: Tokenomics = new Tokenomics();
  subscription: Subscription[] = [];
  solValueApi: number = 0.0;
  nameTokenomics: string;
  valueTokenomics: number;
  burned = 0;
  valueUnloked = 0;
  solValueTotal = 0;
  totalDollarsInLiquidity = 0;
  oldMcap: number;
  oldSoftCap: number;

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

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

  onCalcFairLaunchRate() {
    if (this.fairLaunch.SoftCap) {
      this.fairLaunch.FairLaunchRate =
        this.fairLaunch.TotalTokensForFairLaunch / this.fairLaunch.SoftCap;

      this.oldSoftCap = this.fairLaunch.SoftCap;
    }

    this.onCalcTotalTokensForLiquidity();
  }

  onCalcTotalTokensForLiquidity() {
    if (this.fairLaunch.TotalSupply) {
      if (
        this.fairLaunch.LiquidityPercentage &&
        this.fairLaunch.LiquidityPercentage < 15
      ) {
        alert(
          'Error: Liquidity Percent % - Allowed value greater than or equal to 15'
        );
        this.fairLaunch.LiquidityPercentage = 15;
        this.onCalcTotalTokensForLiquidity();
        return;
      }

      this.fairLaunch.TotalTokensForLiquidity =
        this.fairLaunch.TotalTokensForFairLaunch *
        0.95 *
        (this.fairLaunch.LiquidityPercentage / 100);

      this.onCalcTotalTokensNeeded();
    }
  }

  onCalcTotalTokensNeeded() {
    this.fairLaunch.TotalTokensNeededOnePercentageSolpad =
      1.02 * (this.fairLaunch.FairLaunchRate * this.fairLaunch.SoftCap) +
      (0.95 *
        (this.fairLaunch.FairLaunchRate * this.fairLaunch.SoftCap) *
        this.fairLaunch.LiquidityPercentage) /
        100;

    this.onCalcIsWork();
    this.onCalcTotalSol();
    this.setListTokenomics();
    this.onCalcTotalDollarsInLiquidity();
  }

  onCalcIsWork() {
    this.fairLaunch.IsWork =
      this.fairLaunch.TotalSupply - this.fairLaunch.TotalTokensNeeded;
    this.fairLaunch.YouWillUseHowManyTotalSupply =
      (this.fairLaunch.TotalTokensNeeded / this.fairLaunch.TotalSupply) * 100;
  }

  onCalcTotalSol() {
    this.fairLaunch.TotalSolOwnerWallet =
      this.fairLaunch.SoftCap *
      (1 - this.fairLaunch.LiquidityPercentage / 100) *
      0.95;

    this.fairLaunch.TotalSolForLiquidity =
      this.fairLaunch.SoftCap *
      (this.fairLaunch.LiquidityPercentage / 100) *
      0.95;
  }

  setListTokenomics() {
    let liquidity =
      this.fairLaunch.YouWillUseHowManyTotalSupply > 0
        ? (this.fairLaunch.TotalTokensForLiquidity /
            this.fairLaunch.TotalSupply) *
          100
        : 0;
    let presale = this.fairLaunch.YouWillUseHowManyTotalSupply - liquidity;
    this.valueUnloked = 100 - this.fairLaunch.YouWillUseHowManyTotalSupply;

    if (
      !this.fairLaunch.ListTokenomics ||
      this.fairLaunch.ListTokenomics.length === 0
    ) {
      this.fairLaunch.ListTokenomics = [
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
          Value: this.valueUnloked,
          IsEditable: false,
          Color: '#ffcc56',
        },
      ];
    } else {
      this.fairLaunch.ListTokenomics.filter((n) => n.Name === 'PreSale').map(
        (element) => {
          element.Value = presale;
        }
      );

      this.fairLaunch.ListTokenomics.filter((n) => n.Name === 'Liquidity').map(
        (element) => {
          element.Value = liquidity;
        }
      );

      this.fairLaunch.ListTokenomics.filter((n) => n.Name === 'Unlocked').map(
        (element) => {
          element.Value = this.onGetTotalUnloked();
        }
      );
    }

    this.calcBnbInToken(this.fairLaunch.ListTokenomics);
    this.onSetValuesTokenomics();
  }

  onGetTotalUnloked(): any {
    let total = 0;
    let totalUnloked = 0;

    this.fairLaunch.ListTokenomics.forEach((element) => {
      if (element.Name !== 'Unlocked') {
        total = total + element.Value;
        totalUnloked = 100 - total;
      }
    });

    if (totalUnloked < 0) {
      this.fairLaunch.ListTokenomics[2].Value = 0;
      let message =
        'Error: Informed value exceeds total allowed. There is only ' +
        this.valueUnloked.toFixed(2) +
        '% available to distribute';
      alert(message);
      return this.onGetTotalUnloked();
    } else {
      this.valueUnloked = totalUnloked;
      return totalUnloked;
    }
  }

  onCalcTotalDollarsInLiquidity() {
    if (
      this.solValueApi > 0 &&
      this.fairLaunch.TotalSupply > 0 &&
      this.fairLaunch.TotalTokensForLiquidity > 0
    ) {
      this.solValueTotal = 1;
      this.totalDollarsInLiquidity =
        this.fairLaunch.TotalSolForLiquidity * this.solValueApi;

      this.onCalcMcap();
    }
  }

  onCalcChangeMcap() {
    this.fairLaunch.SoftCap =
      (this.oldSoftCap / this.fairLaunch.Mcap) * this.oldMcap;

    this.onCalcFairLaunchRate();
  }

  onCalcMcap() {
    let totalSupplyForMacp =
      this.fairLaunch.TotalSupply -
      this.fairLaunch.TotalSupply * (this.burned / 100);
    this.fairLaunch.Mcap =
      (this.totalDollarsInLiquidity / this.fairLaunch.TotalTokensForLiquidity) *
      totalSupplyForMacp;

    this.oldMcap = this.fairLaunch.Mcap;
  }

  calcBnbInToken(listTokenomics: Tokenomics[]) {
    let valueBnbInToken = this.fairLaunch.SoftCap || 0;
    let quantitySol =
      valueBnbInToken === 0 ? 0 : this.fairLaunch.TotalSupply / valueBnbInToken;

    listTokenomics.forEach((element) => {
      if (quantitySol > 0) {
        element.Sol = quantitySol * (element.Value / 100);
      } else {
        element.Sol = 0;
      }
    });
  }

  onSetValuesTokenomics() {
    let value: number[] = [];
    let color: string[] = [];
    let name: string[] = [];

    this.fairLaunch.ListTokenomics.forEach((ret) => {
      value.push(ret.Value);
      color.push(ret.Color);
      name.push(ret.Name);
    });

    this.chartCreate(value, color, name);
  }

  formatNumber(a: any) {
    return a.replace(/,/g, ' ');
  }

  onGenerateColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }

  onSetNewTokenomicsClick(nameTokenomics: string, valueTokenomics: number) {
    if (valueTokenomics <= this.valueUnloked) {
      this.fairLaunch.ListTokenomics.push({
        Name: nameTokenomics,
        Value: valueTokenomics,
        IsEditable: true,
        Color: this.onGenerateColor(),
      });

      this.fairLaunch.ListTokenomics.filter((n) => n.Name === 'Unlocked').map(
        (element) => {
          element.Value = this.onGetTotalUnloked();
        }
      );

      this.nameTokenomics = '';
      this.valueTokenomics = 0;

      this.onSetValuesTokenomics();
      this.onCalcSolInToken(this.fairLaunch.ListTokenomics);
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

    this.fairLaunch.ListTokenomics.filter((n) => n.Name === 'Unlocked').map(
      (element) => {
        element.Value = this.onGetTotalUnloked();
      }
    );

    this.burned = this.onGetValueBurned();

    this.onSetValuesTokenomics();
    this.onCalcSolInToken(this.fairLaunch.ListTokenomics);
    this.onCalcTotalDollarsInLiquidity();
  }

  onGetValueBurned() {
    return this.fairLaunch.ListTokenomics.filter((n) => n.Name === 'Burned')[0]
      .Value;
  }

  onCalcSolInToken(listTokenomics: Tokenomics[]) {
    let valueSolInToken = this.fairLaunch.SoftCap || 0;
    let quantitySol =
      valueSolInToken === 0 ? 0 : this.fairLaunch.TotalSupply / valueSolInToken;

    listTokenomics.forEach((element) => {
      if (quantitySol > 0) {
        element.Sol = quantitySol * (element.Value / 100);
      } else {
        element.Sol = 0;
      }
    });
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
