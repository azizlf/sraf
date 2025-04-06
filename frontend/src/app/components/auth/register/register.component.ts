import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  form = new FormGroup({
    login: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
    name: new FormControl("", [Validators.required])
  })

}
