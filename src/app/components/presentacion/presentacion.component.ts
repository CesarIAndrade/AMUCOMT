import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Interfaces
import { Presentacion } from 'src/app/interfaces/presentacion/presentacion';

// Services
import { InventarioService } from 'src/app/services/inventario.service';

// SweetAlert
import sweetalert from 'sweetalert';

@Component({
  selector: 'app-presentacion',
  templateUrl: './presentacion.component.html',
  styleUrls: ['./presentacion.component.css']
})
export class PresentacionComponent implements OnInit {

  myForm: FormGroup;
  @ViewChild('testButton', { static: false }) testButton: ElementRef;

  constructor(private inventarioService: InventarioService) {
    this.myForm = new FormGroup({
      _presentacion: new FormControl('', [Validators.required])
    })
  }

  idPresentacion = '0';
  botonIngresar = 'ingresar';
  filterPresentacion = '';
  inputPresentacion = true;

  presentaciones: Presentacion[] = [];

  onChangeInputPresentacion() {
    this.inputPresentacion = true;
  }

  consultarPresentaciones() {
    this.inventarioService.consultarPresentaciones(
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          this.presentaciones = [];
          this.presentaciones = ok['respuesta'];
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  validarFormulario() {
    if (this.myForm.valid) {
      if (this.testButton.nativeElement.value == 'ingresar') {
        this.crearPresentacion();
      } else if (this.testButton.nativeElement.value == 'modificar') {
        this.actualizarPresentacion();
      }
    } else {
      console.log("Algo Salio Mal");
    }
  }

  crearPresentacion() {
    this.inventarioService.crearPresentacion(
      this.myForm.get('_presentacion').value,
      localStorage.getItem('miCuenta.postToken')
    )
      .then(
        ok => {
          console.log(ok['respuesta']);
          if (ok['respuesta'] == null) {
            sweetAlert("Inténtalo de nuevo!", {
              icon: "warning",
            });
            this.myForm.reset();
          } else if (ok['respuesta'] == '400') {
            this.inputPresentacion = false;
          } else if (ok['respuesta'] == 'false') {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
          } else {
            sweetAlert("Se ingresó correctamente!", {
              icon: "success",
            });
            this.myForm.reset();
            this.consultarPresentaciones();
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  mostrarPresentacion(presentacion) {
    this.idPresentacion = presentacion.IdPresentacion;
    this.myForm.setValue({
      _presentacion: presentacion.Descripcion
    })
    this.testButton.nativeElement.value = 'modificar';
  }

  actualizarPresentacion() {
    this.inventarioService.actualizarPresentacion(
      this.idPresentacion,
      this.myForm.get('_presentacion').value,
      localStorage.getItem('miCuenta.putToken')
    )
      .then(
        ok => {
          if (ok['respuesta'] == null) {
            sweetAlert("Inténtalo de nuevo!", {
              icon: "warning",
            });
          } else if (ok['respuesta'] == '400') {
            this.inputPresentacion = false;
          } else if (ok['respuesta'] == 'false') {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
          } else {
            sweetAlert("Se ingresó correctamente!", {
              icon: "success",
            });
            this.myForm.reset();
            this.testButton.nativeElement.value = 'ingresar';
            this.consultarPresentaciones();
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  eliminarPresentacion(idPresentacion) {
    sweetalert({
      title: "Advertencia",
      text: "¿Está seguro que desea eliminar?",
      icon: "warning",
      buttons: ['Cancelar', 'Ok'],
      dangerMode: true
    })
      .then((willDelete) => {
        if (willDelete) {
          this.inventarioService.eliminarPresentacion(
            idPresentacion,
            localStorage.getItem('miCuenta.deleteToken')
          )
            .then(
              ok => {
                if (ok['respuesta']) {
                  sweetAlert("Se a eliminado correctamente!", {
                    icon: "success",
                  });
                  this.consultarPresentaciones();
                } else {
                  sweetAlert("No se ha podido elminiar!", {
                    icon: "error",
                  });
                }
              }
            )
            .catch(
              error => {
                console.log(error);
              }
            )
        }
      });
  }

  get _presentacion() {
    return this.myForm.get('_presentacion');
  }

  ngOnInit() {
    this.consultarPresentaciones();
  }

  tablaPresentaciones = ['descripcion', 'acciones'];

}