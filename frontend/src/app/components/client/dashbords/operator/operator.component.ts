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

declare function createChart(ctx: any, config: any): void

@Component({
  selector: 'app-operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.css']
})
export class OperatorComponent implements OnInit, AfterViewInit {

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
  consumers: any = []

  consumerSelected = ""
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

  constructor(private dataService: DataSService) { }

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap() {

    const features = this.locations.map(loc => {
      const point = new Feature({
        geometry: new Point(fromLonLat([loc.lon, loc.lat])),
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
    })

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: features,
      }),
    })

    // this.map.addLayer(vectorLayer)

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: new View({
        center: fromLonLat([0, 20]),
        zoom: 1,
      }),
    })

  }

  applySearch() {
    const req = {
      consumer: this.consumerSelected,
      product: this.productSelected,
      catalog: this.catalogSelected
    }

    console.log(req)

  }

  createChart1() {

    const ctx = document.querySelector("#chart1")

    const config = {
      type: 'line',
      data: {
        labels: ['12-03-2025', '13-03-2025', '14-03-2025', '15-03-2025', '16-03-2025', '17-03-2025'],
        datasets: [{
          label: 'Number of catalogs',
          data: [65, 59, 17, 81, 56, 8],
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

  createChart2() {

    const ctx = document.querySelector("#chart2")

    const config = {
      type: 'line',
      data: {
        labels: ['12-03-2025', '13-03-2025', '14-03-2025', '15-03-2025', '16-03-2025', '17-03-2025'],
        datasets: [{
          label: 'Number of transactions ( providers )',
          data: [65, 59, 17, 81, 56, 8],
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
      type: 'line',
      data: {
        labels: ['12-03-2025', '13-03-2025', '14-03-2025', '15-03-2025', '16-03-2025', '17-03-2025'],
        datasets: [{
          label: 'Number of providers',
          data: [65, 59, 17, 81, 56, 8],
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
    this.createChart1()
    this.createChart2()
    this.createChart3()
  }

}