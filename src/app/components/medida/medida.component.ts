import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl } from '@angular/material';
// Services
import { InventarioService } from 'src/app/services/inventario.service';

// SweetAlert
import sweetalert from 'sweetalert';

@Component({
  selector: 'app-medida',
  templateUrl: './medida.component.html',
  styleUrls: ['./medida.component.css']
})
export class MedidaComponent implements OnInit {

  myForm: FormGroup;

  constructor(private inventarioService: InventarioService) {
    this.myForm = new FormGroup({
      _medida: new FormControl('', [Validators.required]),
      _idMedida: new FormControl(''),
    })
  }

  filterMedida = '';
  botonIngresar = 'ingresar';

  //medidas: any[] = [];
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  medidas = new MatTableDataSource<Element[]>();
  consultarMedidas() {
    this.inventarioService.consultarMedidas(
      localStorage.getItem('miCuenta.getToken')
    )
      .then(
        ok => {
          this.medidas.data = [];
          this.medidas.data = ok['respuesta'];
          this.medidas.paginator = this.paginator;
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
      if (this.botonIngresar == 'ingresar') {
        this.crearMedida();
      } else if (this.botonIngresar == 'modificar') {
        this.actualizarMedida();
      }
    } else {
      console.log("Algo Salio Mal");
    }
  }

  crearMedida() {
    this.inventarioService.crearMedida(
      this._medida.value,
      localStorage.getItem('miCuenta.postToken')
    )
      .then(
        ok => {
          if (ok['respuesta'] == null) {
            sweetAlert("Inténtalo de nuevo!", {
              icon: "warning",
            });
            this.myForm.reset();
          } else if (ok['respuesta'] == '400') {
            sweetAlert("Medida ya existe!", {
              icon: "warning",
            });
          } else if (ok['respuesta'] == 'false') {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
          } else {
            sweetAlert("Se ingresó correctamente!", {
              icon: "success",
            });
            this.myForm.reset();
            this.consultarMedidas();
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  mostrarMedida(medida) {
    this._medida.setValue(medida.IdMedida);
    this._medida.setValue(medida.Descripcion)
    this.botonIngresar = 'modificar';
  }

  actualizarMedida() {
    this.inventarioService.actualizarMedida(
      this._idMedida.value,
      this._medida.value,
      localStorage.getItem('miCuenta.putToken')
    )
      .then(
        ok => {
          if (ok['respuesta'] == null) {
            sweetAlert("Inténtalo de nuevo!", {
              icon: "warning",
            });
          } else if (ok['respuesta'] == '400') {
            sweetAlert("Medida ya existe!", {
              icon: "warning",
            });
          } else if (ok['respuesta'] == 'false') {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
          } else {
            sweetAlert("Se ingresó correctamente!", {
              icon: "success",
            });
            this.myForm.reset();
            this.botonIngresar = 'ingresar';
            this.consultarMedidas();
          }
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  eliminarMedida(idMedida) {
    sweetalert({
      title: "Advertencia",
      text: "¿Está seguro que desea eliminar?",
      icon: "warning",
      buttons: ['Cancelar', 'Ok'],
      dangerMode: true
    })
      .then((willDelete) => {
        if (willDelete) {
          this.inventarioService.eliminarMedida(
            idMedida,
            localStorage.getItem('miCuenta.deleteToken')
          )
            .then(
              ok => {
                if (ok['respuesta']) {
                  sweetAlert("Se a eliminado correctamente!", {
                    icon: "success",
                  });
                  this.consultarMedidas();
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

  get _medida() {
    return this.myForm.get('_medida');
  }

  get _idMedida() {
    return this.myForm.get('_idMedida');
  }

  ngOnInit() {
    this.consultarMedidas();
  }

  tablaMedidas = ['descripcion', 'acciones'];

}
