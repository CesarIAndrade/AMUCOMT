import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

// Components
import { ModalDetallePersonaComponent } from "src/app/components/modal-detalle-persona/modal-detalle-persona.component";

// Functional Components
import { MatDialog } from "@angular/material/dialog";

// Interfaces
import { Persona } from "../../interfaces/persona/persona";
import { TipoDocumento } from "../../interfaces/tipo-documento/tipo-documento";
import { Provincia } from 'src/app/interfaces/provincia/provincia';
import { Canton } from 'src/app/interfaces/canton/canton';
import { Parroquia } from 'src/app/interfaces/parroquia/parroquia';
import { TipoTelefono } from 'src/app/interfaces/tipo-telefono/tipo-telefono';
import { Telefono } from 'src/app/interfaces/telefono/telefono';
import { PersonaModal } from "src/app/interfaces/persona/persona-modal";

// Services
import { PersonaService } from "../../services/persona.service";

// SweetAlert
import sweetalert from "sweetalert"

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {

  myForm: FormGroup;
  @ViewChild('testButton', { static: false }) testButton: ElementRef;

  constructor(
    private personaService: PersonaService,
    private dialog: MatDialog,
  ) {
    this.myForm = new FormGroup({
      _nombres: new FormControl('', [Validators.required]),
      _apellidos: new FormControl('', [Validators.required]),
      _numeroDocumento: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      _telefono1: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      _telefono2: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      _correo: new FormControl('', [Validators.email]),
      _tipoDocumento: new FormControl('', [Validators.required]),
      _tipoTelefono1: new FormControl('', [Validators.required]),
      _tipoTelefono2: new FormControl('', [Validators.required]),
      _provincia: new FormControl('', [Validators.required]),
      _canton: new FormControl('', [Validators.required]),
      _parroquia: new FormControl('', [Validators.required]),
    });
  }

  asignacionPersonaParroquia: string;
  idCorreo: string;
  idPersona: string;
  idTelefono1: string;
  idTelefono2: string;

  botonInsertar = "insertar";
  contacto = 'Contacto ';
  direccion = 'Direccion';
  filterPersona = '';
  guardar = 'Guardar';
  nuevaPersona = 'Nueva Persona';

  cantones: Canton[] = [];
  parroquias: Parroquia[] = [];
  personaModal: PersonaModal = {};
  personas: Persona[] = [];
  provincias: Provincia[] = [];
  telefonos: Telefono[] = [];
  tipoDocumentos: TipoDocumento[] = [];
  tipoTelefonos: TipoTelefono[] = [];

  consultarProvincias() {
    this.personaService.consultarProvincias(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.provincias = ok['respuesta'];
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarCantones() {
    this.personaService.consultarCantones(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.cantones = ok['respuesta'];
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarParroquias() {
    this.personaService.consultarParroquias(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.parroquias = ok['respuesta'];
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarPersonas() {
    this.personaService.consultarPersonas(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.personas = ok['respuesta'];
        },
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarTipoDocumento() {
    this.personaService.consultarTipoDocumento(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.tipoDocumentos = ok['respuesta'];
        },
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarTipoTelefono() {
    this.personaService.consultarTipoTelefono(localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.tipoTelefonos = ok['respuesta'];
        },
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarCantonesDeUnaProvincia(
    idProvincia: string,
    value?: string
  ) {
    this.personaService.consultarCantonesDeUnaProvincia(
      idProvincia,
      localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.cantones = ok['respuesta'];
          if (value == 'ingresar') {
            this.myForm.get('_canton').setValue('0');
            this.myForm.get('_parroquia').setValue('0');
            this.parroquias = null;
          }
        },
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  consultarParroquiasDeUnCanton(
    idCanton: string,
    value?: string,
  ) {
    this.personaService.consultarParroquiasDeUnCanton(
      idCanton, localStorage.getItem('miCuenta.getToken'))
      .then(
        ok => {
          this.parroquias = ok['respuesta'];
          if (value == 'ingresar') {
            this.myForm.get('_parroquia').setValue('0');
          }
        },
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  validarNombres(validarDosNombres) {
    var arrayNombres = this.myForm.get('_nombres').value.split(' ');
    if (arrayNombres.length == 1) {
      sweetAlert("Necesita dos Nombres!", {
        icon: "warning",
      });
    } else if (arrayNombres.length >= 2) {
      if (arrayNombres[0].length > 0 && arrayNombres[1].length > 0) {
        validarDosNombres.primerCampo = arrayNombres[0];
        validarDosNombres.segundoCampo = arrayNombres[1];
        validarDosNombres.valido = true;
        return validarDosNombres;
      } else {
        sweetAlert("Necesita dos Nombres!", {
          icon: "warning",
        });
      }
    }
  }

  validarApellidos(validarDosApellidos) {
    var arrayApellidos = this.myForm.get('_apellidos').value.split(' ');
    if (arrayApellidos.length == 1) {
      sweetAlert("Necesita dos apellidos!", {
        icon: "warning",
      });
    } else if (arrayApellidos.length >= 2) {
      if (arrayApellidos[0].length > 0 && arrayApellidos[1].length > 0) {
        validarDosApellidos.primerCampo = arrayApellidos[0];
        validarDosApellidos.segundoCampo = arrayApellidos[1];
        validarDosApellidos.valido = true;
        return validarDosApellidos;
      } else {
        sweetAlert("Necesita dos apellidos!", {
          icon: "warning",
        });
      }
    }
  }

  validarFormulario() {
    if (this.myForm.valid) {
      if (this.testButton.nativeElement.value == 'insertar') {
        this.crearPersona();
      } else if (this.testButton.nativeElement.value == 'modificar') {
        this.actualizarPersona();
      }
    } else {
      console.log("Algo Salio Mal");
    }
  }

  crearPersona() {
    console.log(this.myForm.value);
    var validarNombress = {
      primerCampo: '',
      segundoCampo: '',
      valido: Boolean
    }
    var validarApellidos = {
      primerCampo: '',
      segundoCampo: '',
      valido: Boolean
    }
    var dosNombres = this.validarNombres(validarNombress);
    var dosApellidos = this.validarApellidos(validarApellidos);
    if (dosNombres.valido == true && dosApellidos.valido == true) {
      this.personaService.crearPersona(
        this.myForm.get('_numeroDocumento').value,
        this.myForm.get('_tipoDocumento').value,
        dosApellidos.primerCampo,
        dosApellidos.segundoCampo,
        dosNombres.primerCampo,
        dosNombres.segundoCampo,
        localStorage.getItem('miCuenta.postToken'))
        .then(
          ok => {
            if (ok['respuesta'] == 'false') {
              sweetAlert("Cédula ya existe!", {
                icon: "warning",
              });
            } else if (ok['respuesta'] == '400') {
              this.myForm.reset();
              sweetAlert("Ha ocurrido un error!", {
                icon: "error",
              });
            } else {
              this.idPersona = ok['respuesta'];
              this.crearTelefono(this.idPersona);
            }
          },
        )
        .catch(
          error => {
            console.log(error);
          }
        )
    }
  }

  crearTelefono(idPersona: string) {
    this.telefonos.push(
      {
        IdPersona: idPersona,
        Numero: this.myForm.get('_telefono1').value,
        IdTipoTelefono: this.myForm.get('_tipoTelefono1').value,
      },
      {
        IdPersona: idPersona,
        Numero: this.myForm.get('_telefono2').value,
        IdTipoTelefono: this.myForm.get('_tipoTelefono2').value,
      }
    )
    this.telefonos.map(
      item => {
        this.personaService.crearTelefono(
          item.IdPersona,
          item.Numero,
          item.IdTipoTelefono,
          localStorage.getItem('miCuenta.postToken'))
          .then(
            ok => {
              if (ok['respuesta']) {
                this.crearCorreo(this.idPersona);
              } else {
                sweetAlert("Ha ocurrido un error!", {
                  icon: "error",
                });
                this.myForm.get('_telefono1').setValue('');
                this.myForm.get('_telefono2').setValue('');
                this.myForm.get('_tipoTelefono1').setValue('');
                this.myForm.get('_tipoTelefono2').setValue('');
              }
            },
          )
          .catch(
            error => {
              console.log(error);
            }
          )
      }
    )
  }

  crearCorreo(idPersona: string) {
    this.personaService.crearCorreo(
      idPersona,
      this.myForm.get('_correo').value,
      localStorage.getItem('miCuenta.postToken'))
      .then(
        ok => {
          if (ok['respuesta']) {
            this.crearDireccion(this.idPersona);
          } else {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
            this.myForm.get('_correo').setValue('');
          }
        },
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  crearDireccion(idPersona: string) {
    this.personaService.crearDireccion(
      idPersona,
      this.myForm.get('_parroquia').value,
      localStorage.getItem('miCuenta.postToken'))
      .then(
        ok => {
          if (ok['respuesta']) {
            this.myForm.reset();
            this.consultarPersonas();
            sweetAlert("Se ingresó correctamente!", {
              icon: "success",
            });
          } else {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
            this.myForm.get('_provincia').setValue('0');
            this.myForm.get('_canton').setValue('0');
            this.myForm.get('_parroquia').setValue('0');
          }
        },
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  eliminarPersona(idPersona: string) {
    sweetalert({
      title: "Advertencia",
      text: "¿Está seguro que desea eliminar?",
      icon: "warning",
      buttons: ['Cancelar', 'Ok'],
      dangerMode: true
    })
      .then((willDelete) => {
        if (willDelete) {
          this.personaService.eliminarPersona(
            idPersona,
            localStorage.getItem('miCuenta.deleteToken'))
            .then(
              ok => {
                sweetalert("Se ha eliminado correctamente!", {
                  icon: "success",
                });
                this.consultarPersonas();
              },
            )
            .catch(
              error => {
                console.log(error);
              }
            )
        }
      });
  }

  abrirModal(persona) {
    let dialogRef = this.dialog.open(ModalDetallePersonaComponent, {
      width: '500px',
      height: '500px',
      data: {
        persona: persona
      }
    });
  }

  mostrarPersona(persona) {
    this.nuevaPersona = 'Modificar Persona';
    this.contacto = 'Modificar Contacto';
    this.direccion = 'Modificar Direccion';
    this.guardar = 'Modificar';
    this.idPersona = persona.IdPersona;
    var nombres = persona.PrimerNombre + ' ' + persona.SegundoNombre;
    var apellidos = persona.ApellidoPaterno + ' ' + persona.ApellidoMaterno;
    if (persona.ListaCorreo == null) {
      this.myForm.get('_correo').setValue('Sin Correo');
    } else {
      this.idCorreo = persona.ListaCorreo[0].IdCorreo;
      this.myForm.get('_correo').setValue(persona.ListaCorreo[0].CorreoValor);
    }
    this.myForm.get('_nombres').setValue(nombres);
    this.myForm.get('_apellidos').setValue(apellidos);
    this.myForm.get('_tipoDocumento').setValue(persona.IdTipoDocumento);
    this.myForm.get('_numeroDocumento').setValue(persona.NumeroDocumento);
    this.idTelefono1 = persona.ListaTelefono[0].IdTelefono;
    this.myForm.get('_telefono1').setValue(persona.ListaTelefono[0].Numero);
    this.myForm.get('_tipoTelefono1').setValue(persona.ListaTelefono[0].TipoTelefono.IdTipoTelefono);
    this.idTelefono2 = persona.ListaTelefono[1].IdTelefono;
    this.myForm.get('_telefono2').setValue(persona.ListaTelefono[1].Numero);
    this.myForm.get('_tipoTelefono2').setValue(persona.ListaTelefono[1].TipoTelefono.IdTipoTelefono);
    this.myForm.get('_provincia').setValue(persona.AsignacionPersonaParroquia[0].Parroquia.Canton.Provincia.IdProvincia);
    this.consultarCantonesDeUnaProvincia(this.myForm.get('_provincia').value, '');
    this.myForm.get('_canton').setValue(persona.AsignacionPersonaParroquia[0].Parroquia.Canton.IdCanton);
    this.consultarParroquiasDeUnCanton(this.myForm.get('_canton').value, '');
    this.myForm.get('_parroquia').setValue(persona.AsignacionPersonaParroquia[0].Parroquia.IdParroquia);
    this.asignacionPersonaParroquia = persona.AsignacionPersonaParroquia[0].IdAsignacionPC;
    this.testButton.nativeElement.value = 'modificar';
  }

  actualizarPersona() {
    var validarNombress = {
      primerCampo: '',
      segundoCampo: '',
      valido: Boolean
    }
    var validarApellidos = {
      primerCampo: '',
      segundoCampo: '',
      valido: Boolean
    }
    var dosNombres = this.validarNombres(validarNombress);
    var dosApellidos = this.validarApellidos(validarApellidos);
    if (dosNombres.valido == true && dosApellidos.valido == true) {
      this.personaService.actualizarPersona(
        this.idPersona,
        this.myForm.get('_numeroDocumento').value,
        this.myForm.get('_tipoDocumento').value,
        dosApellidos.primerCampo,
        dosApellidos.segundoCampo,
        dosNombres.primerCampo,
        dosNombres.segundoCampo,
        localStorage.getItem('miCuenta.putToken'))
        .then(
          ok => {
            if (ok['respuesta'] == 'false') {
              sweetAlert("Cédula ya existe!", {
                icon: "warning",
              });
            } else if (ok['respuesta'] == '400') {
              sweetAlert("Ha ocurrido un error!", {
                icon: "error",
              });
            } else {
              this.actualizarTelefono();
            }
          },
        )
        .catch(
          error => {
            console.log(error);
          }
        )
    }
  }

  actualizarTelefono() {
    this.telefonos.push(
      {
        IdPersona: this.idPersona,
        IdTelefono: this.idTelefono1,
        Numero: this.myForm.get('_telefono1').value,
        IdTipoTelefono: this.myForm.get('_tipoTelefono1').value
      },
      {
        IdPersona: this.idPersona,
        IdTelefono: this.idTelefono2,
        Numero: this.myForm.get('_telefono2').value,
        IdTipoTelefono: this.myForm.get('_tipoTelefono2').value
      }
    )
    this.telefonos.map(
      item => {
        this.personaService.actualizarTelefono(
          item.IdPersona,
          item.IdTelefono,
          item.Numero,
          item.IdTipoTelefono,
          localStorage.getItem('miCuenta.putToken'))
          .then(
            ok => {
              if (ok['respuesta']) {
                this.actualizarCorreo(this.idPersona, this.idCorreo);
              } else {
                sweetAlert("Ha ocurrido un error!", {
                  icon: "error",
                });
              }
            },
          )
          .catch(
            error => {
              console.log(error);
            }
          )
      }
    )
  }

  actualizarCorreo(
    idPersona: string,
    idCorreo: string
  ) {
    this.personaService.actualizarCorreo(
      idPersona,
      idCorreo,
      this.myForm.get('_correo').value,
      localStorage.getItem('miCuenta.putToken'))
      .then(
        ok => {
          if (ok['respuesta']) {
            this.actualizarDireccion(this.idPersona, this.asignacionPersonaParroquia);
          } else {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
          }
        },
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  actualizarDireccion(
    idPersona: string,
    idAsignacionPC: string
  ) {
    this.personaService.actualizarDireccion(
      idPersona,
      idAsignacionPC,
      this.myForm.get('_parroquia').value,
      localStorage.getItem('miCuenta.putToken'))
      .then(
        ok => {
          if (ok['respuesta']) {
            this.myForm.reset();
            this.testButton.nativeElement.value = 'insertar';
            this.consultarPersonas();
            this.nuevaPersona = 'Nueva Persona';
            this.contacto = 'Contacto ';
            this.direccion = 'Direccion';
            this.guardar = 'Guardar';
            sweetAlert("Se actualizó correctamente!", {
              icon: "success",
            });
          } else {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
          }
        },
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  }

  get _nombres() {
    return this.myForm.get('_nombres');
  }

  get _apellidos() {
    return this.myForm.get('_apellidos');
  }

  get _tipoDocumento() {
    return this.myForm.get('_tipoDocumento');
  }

  get _numeroDocumento() {
    return this.myForm.get('_numeroDocumento');
  }

  get _telefono1() {
    return this.myForm.get('_telefono1');
  }

  get _tipoTelefono1() {
    return this.myForm.get('_tipoTelefono1');
  }

  get _telefono2() {
    return this.myForm.get('_telefono2')
  }

  get _tipoTelefono2() {
    return this.myForm.get('_tipoTelefono2')
  }

  get _correo() {
    return this.myForm.get('_correo');
  }

  get _provincia() {
    return this.myForm.get('_provincia');
  }

  get _canton() {
    return this.myForm.get('_canton');
  }

  get _parroquia() {
    return this.myForm.get('_parroquia');
  }

  ngOnInit() {
    this.consultarPersonas();
    this.consultarTipoDocumento();
    this.consultarTipoTelefono();
    this.consultarProvincias();
  }

  tablaPersonas = ['nombres', 'apellidos', 'documento', 'numeroDocumento', 'acciones'];
  matcher = new MyErrorStateMatcher();
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}