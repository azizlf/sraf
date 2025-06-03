import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviremnt } from 'src/envirements/envirement.prod';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  baseUrl = enviremnt.backend + "transaction"

  transactions:any = []

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(this.baseUrl + "/all")
  }

  create(data: any) {
    return this.http.post(this.baseUrl + "/add", data)
  }

  update(id: any, data: any) {
    return this.http.put(this.baseUrl + "/update/" + id, data)
  }

}
