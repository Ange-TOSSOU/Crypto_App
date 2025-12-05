import { Component, AfterViewInit, OnChanges, Input, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
// 1. IMPORT DE LineSeries EST OBLIGATOIRE EN V5
import { createChart, IChartApi, ISeriesApi, LineData, Time, LineStyle, PriceLineOptions, IPriceLine, LineSeries } from 'lightweight-charts';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-graphe',
  templateUrl: './graphe.component.html',
  styleUrls: ['./graphe.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class GrapheComponent implements AfterViewInit, OnChanges {
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  @Input() chartData: number[][] = []; 

  private chart!: IChartApi;
  private lineSeries!: ISeriesApi<'Line'>;

  private priceLines: { 
    min: IPriceLine | null, 
    avg: IPriceLine | null, 
    max: IPriceLine | null 
  } = { min: null, avg: null, max: null };

  ngAfterViewInit(): void {
    this.initChart();
    this.updateChart(); 
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] && !changes['chartData'].firstChange) {
      this.updateChart();
    }
  }

  private initChart(): void {
    if (!this.chartContainer) {
      return;
    }

    this.chart = createChart(this.chartContainer.nativeElement, {
      width: this.chartContainer.nativeElement.clientWidth,
      height: 400,
      layout: {
        background: { color: '#FFFFFF' }, 
        textColor: '#D1D4DC', 
      },
      grid: {
      },
      crosshair: { mode: 0 },
      timeScale: {
        borderColor: '#242733',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // 2. CORRECTION MAJEURE POUR V5 : Utilisation de addSeries(LineSeries, ...)
    // Note : J'ai retiré areaTopColor/areaBottomColor car elles ne sont pas valides pour LineSeries.
    this.lineSeries = this.chart.addSeries(LineSeries, {
      color: '#4A90E2', 
      lineWidth: 1,
      lastValueVisible: false,
      priceLineVisible: false,
      lineType: 0 
    });
    
    new ResizeObserver(entries => {
      if (entries.length > 0 && entries[0].contentRect.width > 0) {
        this.chart.applyOptions({ width: entries[0].contentRect.width });
      }
    }).observe(this.chartContainer.nativeElement);
  }

  private updateChart(): void {
    if (!this.chart || !this.lineSeries || this.chartData.length === 0) {
      this.clearPriceLines();
      return;
    }

    const formattedData: LineData[] = this.chartData.map(item => ({
      time: (item[0] / 1000) as Time, 
      value: item[1]
    }));

    this.lineSeries.setData(formattedData);
    this.calculateAndAddPriceLines(formattedData.map(d => d.value));
    this.chart.timeScale().fitContent(); 
  }

  private calculateAndAddPriceLines(prices: number[]): void {
    this.clearPriceLines();

    if (prices.length === 0) return;

    const minimumPrice = Math.min(...prices);
    const maximumPrice = Math.max(...prices);
    const total = prices.reduce((sum, price) => sum + price, 0);
    const avgPrice = total / prices.length;
    const lineWidth = 2;

    // 3. CORRECTION DU TYPAGE STRICT (Ajout des propriétés manquantes)
    
    const minPriceLine: PriceLineOptions = {
      price: minimumPrice,
      color: '#ef5350',
      lineWidth: lineWidth,
      lineStyle: LineStyle.Dashed,
      axisLabelVisible: true,
      title: 'Min',
      // Propriétés obligatoires en V5 :
      lineVisible: true,
      axisLabelColor: '#ef5350',
      axisLabelTextColor: '#FFFFFF'
    };

    const avgPriceLine: PriceLineOptions = {
      price: avgPrice,
      color: '#D1D4DC',
      lineWidth: lineWidth,
      lineStyle: LineStyle.Dotted,
      axisLabelVisible: true,
      title: 'Avg',
      // Propriétés obligatoires en V5 :
      lineVisible: true,
      axisLabelColor: '#D1D4DC',
      axisLabelTextColor: '#000000'
    };

    const maxPriceLine: PriceLineOptions = {
      price: maximumPrice,
      color: '#26a69a',
      lineWidth: lineWidth,
      lineStyle: LineStyle.Dashed,
      axisLabelVisible: true,
      title: 'Max',
      // Propriétés obligatoires en V5 :
      lineVisible: true,
      axisLabelColor: '#26a69a',
      axisLabelTextColor: '#FFFFFF'
    };

    this.priceLines.min = this.lineSeries.createPriceLine(minPriceLine);
    this.priceLines.avg = this.lineSeries.createPriceLine(avgPriceLine);
    this.priceLines.max = this.lineSeries.createPriceLine(maxPriceLine);
  }

  private clearPriceLines(): void {
    if (this.priceLines.min) {
        this.lineSeries.removePriceLine(this.priceLines.min);
        this.priceLines.min = null;
    }
    if (this.priceLines.avg) {
        this.lineSeries.removePriceLine(this.priceLines.avg);
        this.priceLines.avg = null;
    }
    if (this.priceLines.max) {
        this.lineSeries.removePriceLine(this.priceLines.max);
        this.priceLines.max = null;
    }
  }
}