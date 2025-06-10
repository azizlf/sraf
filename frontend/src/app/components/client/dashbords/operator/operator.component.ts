import { AfterViewInit, Component, OnInit } from '@angular/core';
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
import { DataSService } from 'src/app/services/data-s.service';
import { ArticleService } from 'src/app/services/article.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { FormGroup, FormControl } from '@angular/forms';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

declare function createChart(ctx: any, config: any): void

@Component({
  selector: 'app-operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.css']
})
export class OperatorComponent implements OnInit, AfterViewInit {

  catalogs: any = []
  products: any = []
  providers: any = []

  providerSelected = ""
  productSelected = ""
  catalogSelected = ""

  pageToken = ""

  results: any = []

  map!: Map;
  marker!: Feature;

  locations = [
    { name: 'Tunis', lat: 36.8065, lon: 10.1815 },
    { name: 'Paris', lat: 48.8566, lon: 2.3522 },
    { name: 'Tokyo', lat: 35.6895, lon: 139.6917 }
  ]

  allProducts: any = []

  intervalDates = new FormGroup({
    start: new FormControl(""),
    end: new FormControl(""),
  })

  constructor(private transactionService: TransactionService, private articleService: ArticleService, private dataService: DataSService) { }

  ngAfterViewInit(): void {
  }

  initMap() {

    const locations = this.transactionService.transactions.filter((trs: any) => trs.operator === localStorage.getItem("userid"))

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

  applySearch() {

    const req = {
      catalog: this.catalogSelected,
      provider: this.providerSelected,
      dates: this.intervalDates.value.start + ";" + this.intervalDates.value.end
    }



    this.createChart1(req.dates)
    this.createChart2(req.dates)
    this.createChart3(req.dates)
    this.createChart4(req.dates)

  }

  selectCatalog(cat: any) {

    this.providers = []

    this.catalogSelected = cat

    if (cat === "all") {
      const provs = new Set()
      this.allProducts.forEach((p: any) => {

        provs.add(p.provider)

      })
      this.providers = Array.from(provs)
    } else {
      const provs = new Set()
      this.allProducts.forEach((prd: any) => {

        if (prd.category === cat) {

          provs.add(prd.provider)

        }

      })
      this.providers = Array.from(provs)
    }

  }

  selectProvider(provider: any) {

    this.products = []

    this.providerSelected = provider

    if (provider === "all") {
      this.products = this.allProducts
    } else {
      this.allProducts.forEach((prd: any) => {

        if (prd.provider === provider) {
          this.products.push(prd)
        }

      })
    }

  }

  exportData() {

    let catalogsData: any = []
    let transactionsData: any = []
    let consumersData: any = []
    let providersData: any = []
    let dates: any = []

    const date = this.intervalDates.value.start + ";" + this.intervalDates.value.end

    const startDate = new Date(date.split(";")[0]).getTime()
    const endDate = new Date(date.split(";")[1]).getTime()

    this.transactionService.transactions.forEach((transaction: any) => {

      const transactionDate = new Date(transaction.transaction_date).getTime()

      if (transaction.operator === localStorage.getItem("userid") && (
        transactionDate >= startDate && transactionDate <= endDate
      )) {

        dates.push(transaction.transaction_date)

      }

    })

    dates.forEach((date: any) => {

      const transactions = this.transactionService.transactions.filter((tr: any) => tr.transaction_date === date)

      const catalogs = new Set()
      const consumers = new Set()        
      const providers = new Set()

      transactions.forEach((tr: any) => {

        catalogs.add(tr.category)

        consumers.add(tr.consumer)

        providers.add(tr.provider)

      })

      transactionsData.push({
        date: date,
        value: transactions.length
      })

      consumersData.push({
        date: date,
        value: Array.from(consumers).length
      })

      providersData.push({
        date: date,
        value: Array.from(providers).length
      })

      catalogsData.push({
        date: date,
        value: Array.from(catalogs).length
      })

    })

    const dt = new Date().getDate()+"-"+(new Date().getMonth()+1)+"-"+new Date().getFullYear()+" "+new Date().getHours()+"h"+new Date().getMinutes()

    this.downloadCSV([transactionsData,catalogsData,consumersData,providersData], "operator-dashbord "+dt)

  }

  downloadCSV(data: any[], filename: string) {
    const wb = XLSX.utils.book_new();

    const ws1 = XLSX.utils.json_to_sheet(data[0]);
    const ws2 = XLSX.utils.json_to_sheet(data[1]);
    const ws3 = XLSX.utils.json_to_sheet(data[2]);
    const ws4 = XLSX.utils.json_to_sheet(data[3]);

    XLSX.utils.book_append_sheet(wb, ws1, 'Number Of Transactions');
    XLSX.utils.book_append_sheet(wb, ws2, 'Number Of Catalogs');
    XLSX.utils.book_append_sheet(wb, ws3, 'Number Of Consumers');
    XLSX.utils.book_append_sheet(wb, ws4, 'Number Of Porviders');

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

        if (transaction.operator === localStorage.getItem("userid")) {

          labels.push(transaction.transaction_date)

        }

      })

      labels.forEach((date: any) => {

        const transactions = this.transactionService.transactions.filter((tr: any) => tr.transaction_date === date)

        const catalogs = new Set()

        transactions.forEach((tr: any) => {

          catalogs.add(tr.category)

        })

        data.push(Array.from(catalogs).length)

      })
    } else {

      const startDate = new Date(date.split(";")[0]).getTime()
      const endDate = new Date(date.split(";")[1]).getTime()

      this.transactionService.transactions.forEach((transaction: any) => {

        const transactionDate = new Date(transaction.transaction_date).getTime()

        if (transaction.operator === localStorage.getItem("userid") && (
          transactionDate >= startDate && transactionDate <= endDate
        )) {

          labels.push(transaction.transaction_date)

        }

      })

      labels.forEach((date: any) => {

        const transactions = this.transactionService.transactions.filter((tr: any) => tr.transaction_date === date)

        const catalogs = new Set()

        transactions.forEach((tr: any) => {

          catalogs.add(tr.category)

        })

        data.push(Array.from(catalogs).length)

      })

    }

    const config = {
      type: 'line',
      data: {
        labels: labels.sort((a: any, b: any) => this.parseDMY(b).getTime() - this.parseDMY(a).getTime()).slice(0, 6),
        datasets: [{
          label: 'Number of catalogs',
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

        if (transaction.operator === localStorage.getItem("userid")) {

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

        if (transaction.operator === localStorage.getItem("userid") && (
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
          label: 'Number of transactions',
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

  createChart3(date: any) {

    const oldCtx = document.querySelector("#chart3")
    oldCtx?.remove()
    const container = document.querySelector(".c3")
    const ctx = document.createElement("canvas")
    ctx.id = "chart3"
    ctx.setAttribute("class", "chrt")
    container?.appendChild(ctx)

    const labels: any = []
    const data: any = []

    if (date === "all") {
      this.transactionService.transactions.forEach((transaction: any) => {

        if (transaction.operator === localStorage.getItem("userid")) {

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

        if (transaction.operator === localStorage.getItem("userid") && (
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

  createChart4(date: any) {

    const oldCtx = document.querySelector("#chart4")
    oldCtx?.remove()
    const container = document.querySelector(".c4")
    const ctx = document.createElement("canvas")
    ctx.id = "chart4"
    ctx.setAttribute("class", "chrt")
    container?.appendChild(ctx)

    const labels: any = []
    const data: any = []

    if (date === "all") {
      this.transactionService.transactions.forEach((transaction: any) => {

        if (transaction.operator === localStorage.getItem("userid")) {

          labels.push(transaction.transaction_date)

        }

      })

      labels.forEach((date: any) => {

        const transactions = this.transactionService.transactions.filter((tr: any) => tr.transaction_date === date)

        const providers = new Set()

        transactions.forEach((tr: any) => {

          providers.add(tr.provider)

        })

        data.push(Array.from(providers).length)

      })
    } else {

      const startDate = new Date(date.split(";")[0]).getTime()
      const endDate = new Date(date.split(";")[1]).getTime()

      this.transactionService.transactions.forEach((transaction: any) => {

        const transactionDate = new Date(transaction.transaction_date).getTime()

        if (transaction.operator === localStorage.getItem("userid") && (
          transactionDate >= startDate && transactionDate <= endDate
        )) {

          labels.push(transaction.transaction_date)

        }

      })

      labels.forEach((date: any) => {

        const transactions = this.transactionService.transactions.filter((tr: any) => tr.transaction_date === date)

        const providers = new Set()

        transactions.forEach((tr: any) => {

          providers.add(tr.provider)

        })

        data.push(Array.from(providers).length)

      })

    }

    const config = {
      type: 'line',
      data: {
        labels: labels.sort((a: any, b: any) => this.parseDMY(b).getTime() - this.parseDMY(a).getTime()).slice(0, 6),
        datasets: [{
          label: 'Number of providers',
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

  ngOnInit(): void {
    const checkData = setInterval(() => {
      if (this.articleService.articles.length > 0) {

        const catlgs = new Set()

        this.allProducts = []

        this.articleService.articles.forEach((art: any) => {

          catlgs.add(art.category)
          this.allProducts.push(art)

        })

        this.catalogs = Array.from(catlgs)

        this.initMap()
        this.createChart1("all")
        this.createChart2("all")
        this.createChart3("all")
        this.createChart4("all")

        clearInterval(checkData)
      }
    }, 500)
  }

}