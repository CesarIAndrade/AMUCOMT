import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { PersonasResult } from "../interfaces/persona/personas-result";

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  constructor(private http: HttpClient) { }

  private apiUrl:string = "http://192.168.25.15:90/api/";
  private _headers = new HttpHeaders({'Content-Type':'application/json'});
  private _params = new HttpParams();
  
  consultarPersonas(){
    // return this.http.get(`${this.apiUrl}TalentoHumano/ListaUsuariosClientes);
    return this.http.get<PersonasResult>('http://192.168.25.15:90/api/TalentoHumano/ListaUsuariosClientes');
  }
}