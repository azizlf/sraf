import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  form = new FormGroup({
    email: new FormControl("", [Validators.required,Validators.email]),
    full_name: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required])
  })

  constructor(private userService:UserService){}

  submit(){

    this.userService.update(localStorage.getItem("userid"),this.form.value).subscribe((res:any)=>{

      alert("Updated successfully!")

    })

  }

  initForm(){

    this.userService.getById(localStorage.getItem("userid")).subscribe((res:any)=>{
      this.form.setValue({
        email:res.response.email,
        full_name:res.response.full_name,
        password:res.response.password
      })

    })

  }

  ngOnInit(): void {
    this.initForm()
  }

}
