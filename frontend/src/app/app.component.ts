import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';
import { ArticleService } from './services/article.service';
import { TransactionService } from './services/transaction.service';
import { DataSService } from './services/data-s.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private dataService: DataSService, private transactionService: TransactionService, private userService: UserService, private router: Router, private articleService: ArticleService) { }

  getAllProducts() {

    this.articleService.getAll().subscribe((res: any) => {

      this.articleService.articles = res.response

      if (res.response.length > 0) {
        // this.makeProviders(res.response)
        // this.makeTransactions(this.articleService.articles)
      }

    })

  }

  getAllTransactions() {

    this.transactionService.getAll().subscribe((res: any) => {

      this.transactionService.transactions = res.response

    })

  }

  changeFormatDate(date: any) {
    const d = new Date(date)
    return d.getDate() + "-" + (d.getMonth()) + "-" + d.getFullYear()
  }

  getDataWithApi() {

    this.articleService.getFromApi("").subscribe((res: any) => {

      res.results.forEach((r: any) => {

        let country_coords: any

        this.articleService.counrties_coords.map((c) => {
          if (c.country.toLowerCase() === r.country[0].toLowerCase()) {
            country_coords = c
          }
        })

        if (country_coords) {
          const req = {
            language: r.language,
            location: country_coords.latitude + ";" + country_coords.longitude,
            category: r.category[0],
            pubDate: this.changeFormatDate(r.pubDate.split(" ")[0]),
            provider: r.source_name,
            country: r.country[0],
            title: r.title
          }

          this.articleService.create(req).subscribe((res: any) => {

            console.log(res)

          })
        }

      })

    })

  }

  makeProviders(data: any) {

    data.forEach((d: any) => {

      this.userService.create({
        full_name: d.provider,
        email: d.provider.replace(" ", "").toLowerCase() + "@gmail.com",
        password: d.provider.replace(" ", "").toLowerCase() + "1234",
        role: "provider"
      }).subscribe((res: any) => {

        console.log(res)

      })

    })

  }

  makeTransactions(articles: any) {

    const count = 100

    this.userService.getAll().subscribe((usrs: any) => {

      const users = usrs.response

      const consumers = users.filter((u: any) => u.role === 'consumer');
      const providers = users.filter((u: any) => u.role === 'provider');

      for (let i = 0; i < count; i++) {
        const article = articles[Math.floor(Math.random() * articles.length)];

        const providerUser = providers.find(
          (u:any) => u.full_name === article.provider
        )

        if (!providerUser) continue

        const consumer = consumers[Math.floor(Math.random() * consumers.length)];

        const transaction = {
          article: article._id,
          provider: providerUser._id,
          consumer: consumer._id,
          transaction_date: this.randomDate(),
          country:article.location
        }

        this.transactionService.create(transaction).subscribe((res:any)=>{

          console.log(res)

        })
        
      }

    })

  }


  randomDate(): string {
    const start = new Date(2023, 0, 1).getTime();
    const end = new Date().getTime();
    const date = new Date(start + Math.random() * (end - start));
    return date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear();
  }


  ngOnInit(): void {
    this.getAllProducts()
    this.getAllTransactions()
    // this.getDataWithApi()
    if (!localStorage.getItem("userid") || localStorage.getItem("userid") === "") {
      this.router.navigate(["/auth/login"])
    } else {
      this.dataService.userId = localStorage.getItem("userid") + ""
      this.dataService.role = localStorage.getItem("userrole") + ""
      this.router.navigate(["/" + this.dataService.role + "-dashbord"])
    }
  }


}
