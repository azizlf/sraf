import { AfterViewInit, Component } from '@angular/core';

declare function createChart(ctx: any, config: any): void

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent implements AfterViewInit {

  data = [
    {
      title: "Media",
      catalog: [
        {
          title: "films",
          products: [
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
    },
    {
      title: "Documents",
      catalog: [
        {
          title: "doc 1",
          products: [
            {
              title: "dc 1",
              consumers: ["C1", "C2", "C3"]

            },
            {
              title: "dc 2",
              consumers: ["C1", "C2", "C3"]

            },
            {
              title: "dc 3",
              consumers: ["C1", "C2", "C3"]

            }
          ],
        },
        {
          title: "doc 2",
          products: [
            {
              title: "dd 1",
              consumers: ["C1"]

            },
            {
              title: "dd 2",
              consumers: ["C1", "C2", "C3"]

            },
            {
              title: "dd 3",
              consumers: ["C1", "C2", "C3"]

            }
          ],
        },
        {
          title: "doc 3",
          products: [
            {
              title: "ddc 1",
              consumers: ["C1", "C2", "C3"]

            },
            {
              title: "ddc 2",
              consumers: ["C1", "C2", "C3"]

            },
            {
              title: "ddc 3",
              consumers: []

            }
          ],
        }
      ]
    },
  ]

  catalogs: any = []
  products: any = []
  consumers: any = []

  createChart1() {

    const ctx = document.querySelector("#chart1")

    const config = {
      type: "bar",
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
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

    createChart(ctx,config)

  }

  createChart2() {

    const ctx = document.querySelector("#chart2")

    const config = {
      type: "bar",
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
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

    createChart(ctx,config)

  }
  createChart3() {

    const ctx = document.querySelector("#chart3")

    const config = {
      type: "bar",
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
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

    createChart(ctx,config)

  }

  createChart4() {

    const ctx = document.querySelector("#chart4")

    const config = {
      type: "bar",
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
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

    createChart(ctx,config)

  }
  createChart5() {

    const ctx = document.querySelector("#chart5")

    const config = {
      type: "bar",
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
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

    createChart(ctx,config)

  }

  createChart6() {

    const ctx = document.querySelector("#chart6")

    const config = {
      type: "bar",
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
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

    createChart(ctx,config)

  }
  createChart7() {

    const ctx = document.querySelector("#chart7")

    const config = {
      type: "bar",
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
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

    createChart(ctx,config)

  }

  createChart8() {

    const ctx = document.querySelector("#chart8")

    const config = {
      type: "bar",
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
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

    createChart(ctx,config)

  }

  createChart9() {

    const ctx = document.querySelector("#chart9")

    const config = {
      type: "bar",
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
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

    createChart(ctx,config)

  }


  ngAfterViewInit(): void {
    this.createChart1()
    this.createChart2()
    this.createChart3()
    this.createChart4()
    this.createChart5()
    this.createChart6()
    this.createChart7()
    this.createChart8()
    this.createChart9()
  }

}
