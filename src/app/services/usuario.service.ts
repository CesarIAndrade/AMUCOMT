import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  private apiUrl: string = "http://192.168.25.15:90/api/"

  login(
    usuario: string, 
    contrasena: string, 
    _token: string
  ) {
    const body = new HttpParams()
      .set('usuario', usuario)
      .set('contrasena', contrasena)
      .set('token', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/Login/', body.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        }
      )
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  consultarUsuarios(_token: string) {
    const body = new HttpParams()
    .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/ListaUsuariosSistema', body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        })
    });
  }
  
  consultarPrivilegios(_token: string) {
    const body = new HttpParams()
    .set('encriptada', _token)
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'TalentoHumano/ListaPrivilegio/',
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        })
    });
  }

  consultarModulos(_token: string) {
    
    const body = new HttpParams()
    .set('encriptada', _token)

    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'Usuarios/ListaModulos/', body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        })
    });
  }
}
