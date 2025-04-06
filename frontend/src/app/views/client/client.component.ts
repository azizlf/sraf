import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  route = ""
  openMenuDiag = false

  constructor(private router:Router){}

  logout(){

    this.router.navigate(["/auth/login"])

  }

  ngOnInit(): void {
    this.route = window.location.pathname.split("/")[1]
  }

}
