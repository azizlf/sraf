import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DataSService } from 'src/app/services/data-s.service';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import { ArticleService } from 'src/app/services/article.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { FormGroup, FormControl } from '@angular/forms';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

declare function createChart(ctx: any, config: any): void

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.css']
})
export class ProviderComponent implements OnInit, AfterViewInit {

  intervalDates = new FormGroup({
    start: new FormControl(""),
    end: new FormControl(""),
  })

  catalogs: any = []
  products: any = []
  allProducts: any = []

  pageToken = ""

  results: any = []

  map!: Map;
  marker!: Feature;

  locations = [
    { name: 'Tunis', lat: 36.8065, lon: 10.1815 },
    { name: 'Paris', lat: 48.8566, lon: 2.3522 },
    { name: 'Tokyo', lat: 35.6895, lon: 139.6917 }
  ]

  catalogSelected = ""
  productSelected: any

  constructor(private articleService: ArticleService, private transactionService: TransactionService) { }

  ngAfterViewInit(): void {

  }

  initMap() {

    const locations = this.transactionService.transactions.filter((trs: any) => trs.provider === localStorage.getItem("userid"))

    const features = locations.map((loc: any) => {
      const point = new Feature({
        geometry: new Point(fromLonLat([loc.country.split(";")[1], loc.country.split(";")[0]])),
        name: loc.name
      });

      point.setStyle(new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: '/assets/img/position.png',
          scale: 0.05
        })
      }));

      return point;
    });

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: features,
      }),
    });

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: new View({
        center: fromLonLat([10.1815, 36.8065]),
        zoom: 0,
      }),
    });

  }

  selectCatalog(catalog: any) {

    this.products = []

    this.catalogSelected = catalog

    if (catalog === "all") {
      this.products = this.allProducts
    } else {
      this.allProducts.forEach((prd: any) => {

        if (prd.category === catalog) {
          this.products.push(prd)
        }

      })
    }

  }

  applySearch() {
    const req = {
      catalog: this.catalogSelected,
      product: this.productSelected,
      dates: this.intervalDates.value.start + ";" + this.intervalDates.value.end
    }


    this.createChart1(req.dates)
    this.createChart2(req.dates)

  }

  exportData() {

    let transactionsData: any = []
    let consumersData: any = []
    let dates: any = []

    const date = this.intervalDates.value.start + ";" + this.intervalDates.value.end

    const startDate = new Date(date.split(";")[0]).getTime()
    const endDate = new Date(date.split(";")[1]).getTime()

    this.transactionService.transactions.forEach((transaction: any) => {

      const transactionDate = new Date(transaction.transaction_date).getTime()

      if (transaction.provider === localStorage.getItem("userid") && (
        transactionDate >= startDate && transactionDate <= endDate
      )) {

        dates.push(transaction.transaction_date)

      }

    })

    dates.forEach((date: any) => {

      const transactions = this.transactionService.transactions.filter((tr: any) => tr.transaction_date === date)

      const consumers = new Set()

      transactions.forEach((tr: any) => {

        consumers.add(tr.consumer)

      })

      transactionsData.push({
        date: date,
        value: transactions.length
      })

      consumersData.push({
        date: date,
        value: Array.from(consumers).length
      })

    })

    const dt = new Date().getDate()+"-"+(new Date().getMonth()+1)+"-"+new Date().getFullYear()+" "+new Date().getHours()+"h"+new Date().getMinutes()

    this.downloadCSV([transactionsData, consumersData], "provider-dashbord " + dt)

  }

  downloadCSV(data: any[], filename: string) {
    const wb = XLSX.utils.book_new();

    const ws1 = XLSX.utils.json_to_sheet(data[0]);
    const ws2 = XLSX.utils.json_to_sheet(data[1]);

    XLSX.utils.book_append_sheet(wb, ws1, 'Number Of Transactions');
    XLSX.utils.book_append_sheet(wb, ws2, 'Number Of Consumers');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });

    saveAs(blob, filename + '.xlsx');
  }


  parseDMY(dateStr: string): Date {
    const [day, month, year] = dateStr.split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  createChart1(date: any) {

    const oldCtx = document.querySelector("#chart1")
    oldCtx?.remove()
    const container = document.querySelector(".c1")
    const ctx = document.createElement("canvas")
    ctx.id = "chart1"
    ctx.setAttribute("class", "chrt")
    container?.appendChild(ctx)

    const labels: any = []
    const data: any = []

    if (date === "all") {
      this.transactionService.transactions.forEach((transaction: any) => {

        if (transaction.provider === localStorage.getItem("userid")) {

          labels.push(transaction.transaction_date)

        }

      })

      labels.forEach((date: any) => {

        const transactions = this.transactionService.transactions.filter((tr: any) => tr.transaction_date === date)

        const consumers = new Set()

        transactions.forEach((tr: any) => {

          consumers.add(tr.consumer)

        })

        data.push(Array.from(consumers).length)

      })
    } else {

      const startDate = new Date(date.split(";")[0]).getTime()
      const endDate = new Date(date.split(";")[1]).getTime()

      this.transactionService.transactions.forEach((transaction: any) => {

        const transactionDate = new Date(transaction.transaction_date).getTime()

        if (transaction.provider === localStorage.getItem("userid") && (
          transactionDate >= startDate && transactionDate <= endDate
        )) {

          labels.push(transaction.transaction_date)

        }

      })

      labels.forEach((date: any) => {

        const transactions = this.transactionService.transactions.filter((tr: any) => tr.transaction_date === date)

        const consumers = new Set()

        transactions.forEach((tr: any) => {

          consumers.add(tr.consumer)

        })

        data.push(Array.from(consumers).length)

      })

    }

    const config = {
      type: 'line',
      data: {
        labels: labels.sort((a: any, b: any) => this.parseDMY(b).getTime() - this.parseDMY(a).getTime()).slice(0, 6),
        datasets: [{
          label: 'Number of consumers',
          data: data,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.5
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }

    createChart(ctx, config)

  }

  createChart2(date: any) {

    const oldCtx = document.querySelector("#chart2")
    oldCtx?.remove()
    const container = document.querySelector(".c2")
    const ctx = document.createElement("canvas")
    ctx.id = "chart2"
    ctx.setAttribute("class", "chrt")
    container?.appendChild(ctx)

    const labels: any = []
    const data: any = []
    if (date === "all") {

      this.transactionService.transactions.forEach((transaction: any) => {

        if (transaction.provider === localStorage.getItem("userid")) {

          labels.push(transaction.transaction_date)

        }

      })

      labels.forEach((date: any) => {

        const transactions = this.transactionService.transactions.filter((tr: any) => tr.transaction_date === date)

        data.push(transactions.length)

      })

    } else {
      const startDate = new Date(date.split(";")[0]).getTime()
      const endDate = new Date(date.split(";")[1]).getTime()

      this.transactionService.transactions.forEach((transaction: any) => {

        const transactionDate = new Date(transaction.transaction_date).getTime()

        if (transaction.provider === localStorage.getItem("userid") && (
          transactionDate >= startDate && transactionDate <= endDate
        )) {

          labels.push(transaction.transaction_date)

        }

      })

      labels.forEach((date: any) => {

        const transactions = this.transactionService.transactions.filter((tr: any) => tr.transaction_date === date)

        data.push(transactions.length)

      })
    }


    const config = {
      type: 'line',
      data: {
        labels: labels.sort((a: any, b: any) => this.parseDMY(b).getTime() - this.parseDMY(a).getTime()).slice(0, 6),
        datasets: [{
          label: 'Number of transactions ( consumers )',
          data: data,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.5
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }

    createChart(ctx, config)

  }

  createChart3() {

    const ctx = document.querySelector("#chart3")

    let labels: any = []
    let data: any = []

    const labelsSets = new Set()

    this.allProducts.forEach((art: any) => {

      labelsSets.add(art.category)

    })

    labels = Array.from(labelsSets)

    labels.forEach((lbl: any) => {

      data.push(this.allProducts.filter((ar: any) => ar.category === lbl).length)

    })

    const config = {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: 'Top requested catalog',
          data: data,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }

    createChart(ctx, config)

  }

  ngOnInit(): void {
    const checkData = setInterval(() => {
      if (this.articleService.articles.length > 0) {

        const catlgs = new Set()

        this.allProducts = []

        this.articleService.articles.forEach((art: any) => {

          if (art.provider === localStorage.getItem("provider")) {
            catlgs.add(art.category)
            this.allProducts.push(art)
          }

        })

        this.catalogs = Array.from(catlgs)

        this.createChart1("all")
        this.createChart2("all")
        this.createChart3()
        this.initMap()

        clearInterval(checkData)
      }
    }, 500)
  }

}
