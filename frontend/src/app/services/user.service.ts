import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviremnt } from 'src/envirements/envirement.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = enviremnt.backend + "user"

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(this.baseUrl + "/all")
  }

  getById(id:any) {
    return this.http.get(this.baseUrl + "/"+id)
  }

  create(data: any) {
    return this.http.post(this.baseUrl + "/add", data)
  }

  update(id:any,data: any) {
    return this.http.put(this.baseUrl + "/"+id,data)
  }

  login(data: any) {
    return this.http.post(this.baseUrl + "/login", data)
  }
  
}
