import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataSService } from 'src/app/services/data-s.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  route = ""
  openMenuDiag = false

  constructor(private router:Router,public dataService:DataSService){}

  logout(){

    this.router.navigate(["/auth/login"])
    localStorage.setItem("userid","")
    localStorage.setItem("userrole","")

  }

  ngOnInit(): void {
    this.route = window.location.pathname.split("/")[1]
  }

}
