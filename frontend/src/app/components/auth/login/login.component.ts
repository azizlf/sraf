import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  form = new FormGroup({
    login: new FormControl("",[Validators.required]),
    password: new FormControl("",[Validators.required])
  })

  constructor(private router:Router,private userService:UserService){}

  login(){

    this.router.navigate(["/"])
    this.userService.userId = "1"

  }

}