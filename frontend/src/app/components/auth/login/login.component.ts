import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataSService } from 'src/app/services/data-s.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required])
  })

  constructor(private router: Router, private dataService: DataSService, private userService: UserService) { }

  login() {

    this.userService.login(this.form.value).subscribe((res: any) => {
      if (res.response.status === true) {

        this.dataService.role = res.response.user.role
        this.dataService.userId = res.response.user._id
        localStorage.setItem("userid", res.response.user._id)
        localStorage.setItem("userrole", res.response.user.role)
        if (this.dataService.role === "provider") {
          localStorage.setItem("provider", res.response.user.full_name)
        }
        this.router.navigate(["/" + this.dataService.role + "-dashbord"])
      } else {

        alert(res.response.user)

      }

    })



  }

}