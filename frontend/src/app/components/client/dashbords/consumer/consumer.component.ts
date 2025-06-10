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
import { TransactionService } from 'src/app/services/transaction.service';
import { ArticleService } from 'src/app/services/article.service';
import { FormGroup, FormControl } from '@angular/forms';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

declare function createChart(ctx: any, config: any): void

@Component({
  selector: 'app-consumer',
  templateUrl: './consumer.component.html',
  styleUrls: ['./consumer.component.css']
})
export class ConsumerComponent implements OnInit, AfterViewInit {

  catalogs: any = [
    {
      title: "films",
      products: [
        {
          title: "all"
        },
        {
          title: "f1",
          consumers: ["C1", "C2", "C3"]

        },
        {
          title: "f2",
          consumers: ["C1", "C2", "C3"]

        },
        {
          title: "f3",
          consumers: ["C1", "C2", "C3"]

        }
      ],
    },
    {
      title: "Videos",
      products: [
        {
          title: "v1",
          consumers: ["C1", "C2", "C3"]

        },
        {
          title: "v2",
          consumers: ["C1", "C2", "C3"]

        },
        {
          title: "v3",
          consumers: ["C1", "C2", "C3"]

        }
      ],
    },
    {
      title: "Photos",
      products: [
        {
          title: "p1",
          consumers: []

        },
        {
          title: "p2",
          consumers: ["C1", "C2"]

        },
        {
          title: "p3",
          consumers: ["C1", "C2", "C3"]

        }
      ],
    }
  ]

  products: any = []

  providers: any = []

  catalogSelected = ""
  providerSelected = ""

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

    const locations = this.transactionService.transactions.filter((trs: any) => trs.consumer === localStorage.getItem("userid"))

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

  }

  exportData() {

    let catalogsData: any = []
    let transactionsData: any = []
    let dates: any = []

    const date = this.intervalDates.value.start + ";" + this.intervalDates.value.end

    const startDate = new Date(date.split(";")[0]).getTime()
    const endDate = new Date(date.split(";")[1]).getTime()

    this.transactionService.transactions.forEach((transaction: any) => {

      const transactionDate = new Date(transaction.transaction_date).getTime()

      if (transaction.consumer === localStorage.getItem("userid") && (
        transactionDate >= startDate && transactionDate <= endDate
      )) {

        dates.push(transaction.transaction_date)

      }

    })

    dates.forEach((date: any) => {

      const transactions = this.transactionService.transactions.filter((tr: any) => tr.transaction_date === date)

      const catalogs = new Set()

      transactions.forEach((tr: any) => {

        catalogs.add(tr.category)

      })

      transactionsData.push({
        date: date,
        value: transactions.length
      })

      catalogsData.push({
        date: date,
        value: Array.from(catalogs).length
      })

    })


    const dt = new Date().getDate()+"-"+(new Date().getMonth()+1)+"-"+new Date().getFullYear()+" "+new Date().getHours()+"h"+new Date().getMinutes()

    this.downloadCSV([transactionsData,catalogsData], "consumer-dashbord "+dt)
  }

  downloadCSV(data: any[], filename: string) {
    const wb = XLSX.utils.book_new();

    const ws1 = XLSX.utils.json_to_sheet(data[0]);
    const ws2 = XLSX.utils.json_to_sheet(data[1]);

    XLSX.utils.book_append_sheet(wb, ws1, 'Number Of Transactions');
    XLSX.utils.book_append_sheet(wb, ws2, 'Number Of Catalogs');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });

    saveAs(blob, filename + '.xlsx');
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

        if (transaction.consumer === localStorage.getItem("userid")) {

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

        if (transaction.consumer === localStorage.getItem("userid") && (
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

  parseDMY(dateStr: string): Date {
    const [day, month, year] = dateStr.split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
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

        if (transaction.consumer === localStorage.getItem("userid")) {

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

        if (transaction.consumer === localStorage.getItem("userid") && (
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

  createChart3() {

    const ctx = document.querySelector("#chart3")

    const categoryCounts: { [key: string]: number } = {}

    this.transactionService.transactions.forEach((transaction: any) => {

      if (transaction.consumer === localStorage.getItem("userid")) {

        const category = transaction.category;
        categoryCounts[category] = (categoryCounts[category] || 0) + 1

      }

    })

    const categories = Object.keys(categoryCounts);
    const counts = Object.values(categoryCounts);

    const config = {
      type: 'pie',
      data: {
        labels: categories,
        datasets: [
          {
            label: 'Products',
            data: counts,
            backgroundColor: ["#0a68da", "#bb0888", "#5e08bb"],
          }
        ]
      }
    }

    createChart(ctx, config)

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
        this.createChart3()

        clearInterval(checkData)
      }
    }, 500)
  }

}
