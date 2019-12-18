import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from "@angular/material/dialog";

// Services
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';

// Interfaces
import { TipoDocumentos } from "../../interfaces/tipo-documento/tipo-documento";

export interface personaModal{
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefonoModal1: string;
  telefonoModal2: string;
  telefonoModal3: string;
  correoModal: string;
}

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {

  constructor(private tipoDocumentoService: TipoDocumentoService,
    @Inject(MAT_DIALOG_DATA) private data: personaModal,
    public dialogRef: MatDialogRef<ModalUsuarioComponent>) { }

  persona: personaModal = {
    nombres: '',
    apellidos: '',
    tipoDocumento: '0',
    numeroDocumento: '',
    telefonoModal1: '',
    telefonoModal2: '',
    telefonoModal3: '',
    correoModal: '',
  };

  botonAgregarNumero: boolean = false;
  numeroExtra: boolean = true;
  tipoDocumentos: TipoDocumentos[] = [];

  consultarTipoDocumentos() {
    this.tipoDocumentoService.consultatTipoDocumentos(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          console.log(ok);
          this.tipoDocumentos = ok['respuesta'];
        }
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  }

  agregarTelefono(){
    console.log('worked');
    if(this.numeroExtra == true){
      this.numeroExtra = false;
      this.botonAgregarNumero = true;
    }
  }

  quitarTelefono(){
    console.log('worked');
    if(this.numeroExtra == false){
      this.numeroExtra = true;
      this.botonAgregarNumero = false;
    }
  }

  cerrarModal() {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.consultarTipoDocumentos();
  }

}
