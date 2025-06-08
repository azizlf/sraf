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
        labels: labels.slice(0, 6),
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
        labels: labels.slice(0, 6),
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

    const config = {
      type: 'pie',
      data: {
        labels: ['Videos', 'Articles', 'Others'],
        datasets: [
          {
            label: 'Products',
            data: [104, 198, 167],
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
    this.createChart3()
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

        clearInterval(checkData)
      }
    }, 500)
  }

}
