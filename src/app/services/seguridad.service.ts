import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  constructor(private http: HttpClient) { }

  private apiUrl:string = "http://192.168.25.15:90/api/";
  private _headers = new HttpHeaders({'Content-Type':'application/json'});
  private _params = new HttpParams();

  consultarTokens(){
    return this.http.get(`${this.apiUrl}Seguridad/ConsultarClave`, {headers:this._headers})
  }
}