import { Component, AfterViewInit, OnChanges, Input, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
// 1. CHANGER LES IMPORTS ICI
import { createChart, IChartApi, ISeriesApi, Time, LineStyle, PriceLineOptions, IPriceLine, CandlestickSeries, CandlestickData } from 'lightweight-charts';
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
  
  // Le format d'entrée change : [Time, Open, High, Low, Close]
  @Input() chartData: number[][] = []; 

  private chart!: IChartApi;
  // 2. CHANGER LE TYPE DE SÉRIE
  private candleSeries!: ISeriesApi<'Candlestick'>;

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
    if (!this.chartContainer) return;

    this.chart = createChart(this.chartContainer.nativeElement, {
      width: this.chartContainer.nativeElement.clientWidth,
      height: 400,
      layout: {
        background: { color: '#FFFFFF' }, 
        textColor: '#333', 
      },
      grid: {
        vertLines: { color: '#F0F3FA' },
        horzLines: { color: '#F0F3FA' },
      },
      timeScale: {
        borderColor: '#D1D4DC',
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: true, // Empêcher le scroll vide à gauche
      },
    });

    // 3. UTILISER addSeries(CandlestickSeries)
    this.candleSeries = this.chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',        // Vert pour la hausse
      downColor: '#ef5350',      // Rouge pour la baisse
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });
    
    new ResizeObserver(entries => {
      if (entries.length > 0 && entries[0].contentRect.width > 0) {
        this.chart.applyOptions({ width: entries[0].contentRect.width });
      }
    }).observe(this.chartContainer.nativeElement);
  }

  private updateChart(): void {
    if (!this.chart || !this.candleSeries || this.chartData.length === 0) {
      this.clearPriceLines();
      return;
    }

    // 4. MAPPING OHLC (Open, High, Low, Close)
    // CoinGecko envoie : [Timestamp, Open, High, Low, Close]
    const formattedData: CandlestickData[] = this.chartData.map(item => ({
      time: (item[0] / 1000) as Time, 
      open: item[1],
      high: item[2],
      low: item[3],
      close: item[4]
    }));

    this.candleSeries.setData(formattedData);
    
    // Pour les lignes Min/Max, on se base généralement sur le prix de clôture (close)
    const closePrices = formattedData.map(d => d.close);
    this.calculateAndAddPriceLines(closePrices);
    
    this.chart.timeScale().fitContent(); 
  }

  private calculateAndAddPriceLines(prices: number[]): void {
    this.clearPriceLines();
    if (prices.length === 0) return;

    const minimumPrice = Math.min(...prices);
    const maximumPrice = Math.max(...prices);
    const total = prices.reduce((sum, price) => sum + price, 0);
    const avgPrice = total / prices.length;

    // ... Le reste de votre code pour créer les lignes reste identique ...
    // Juste pour rappel, utilisez this.candleSeries.createPriceLine(...)
    
    // Exemple abrégé pour la réponse :
    this.priceLines.min = this.candleSeries.createPriceLine({
        price: minimumPrice, color: '#ef5350', lineWidth: 2, lineStyle: LineStyle.Dashed, axisLabelVisible: true, title: 'Min', lineVisible: true, axisLabelColor: '#ef5350', axisLabelTextColor: '#FFF'
    });
    this.priceLines.avg = this.candleSeries.createPriceLine({
        price: avgPrice, color: '#333', lineWidth: 2, lineStyle: LineStyle.Dotted, axisLabelVisible: true, title: 'Avg', lineVisible: true, axisLabelColor: '#333', axisLabelTextColor: '#FFF'
    });
    this.priceLines.max = this.candleSeries.createPriceLine({
        price: maximumPrice, color: '#26a69a', lineWidth: 2, lineStyle: LineStyle.Dashed, axisLabelVisible: true, title: 'Max', lineVisible: true, axisLabelColor: '#26a69a', axisLabelTextColor: '#FFF'
    });
  }

  private clearPriceLines(): void {
    // Attention : utilisez candleSeries ici, pas lineSeries
    if (this.priceLines.min) { this.candleSeries.removePriceLine(this.priceLines.min); this.priceLines.min = null; }
    if (this.priceLines.avg) { this.candleSeries.removePriceLine(this.priceLines.avg); this.priceLines.avg = null; }
    if (this.priceLines.max) { this.candleSeries.removePriceLine(this.priceLines.max); this.priceLines.max = null; }
  }
}