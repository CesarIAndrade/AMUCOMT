import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import {
  FormGroup,
  Validators,
  FormControl,
  FormGroupDirective,
  NgForm,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

// Components
import { ModalDetallePersonaComponent } from "src/app/components/modal-detalle-persona/modal-detalle-persona.component";
import { MatPaginator, MatTableDataSource } from "@angular/material";
// Functional Components
import { MatDialog } from "@angular/material/dialog";

// Services
import { PersonaService } from "../../services/persona.service";

// SweetAlert
import sweetalert from "sweetalert";
import { PanelAdministracionService } from "src/app/services/panel-administracion.service";

@Component({
  selector: "app-persona",
  templateUrl: "./persona.component.html",
  styleUrls: ["./persona.component.css"],
})
export class PersonaComponent implements OnInit {
  constructor(
    private personaService: PersonaService,
    private panelAdministracionService: PanelAdministracionService,
    private dialog: MatDialog
  ) {
    this.myForm = new FormGroup({
      _nombres: new FormControl("", [Validators.required]),
      _apellidos: new FormControl("", [Validators.required]),
      _numeroDocumento: new FormControl("", [
        Validators.required,
        Validators.maxLength(10),
      ]),
      _telefono1: new FormControl("", [
        Validators.required,
        Validators.maxLength(10),
      ]),
      _telefono2: new FormControl("", [
        Validators.required,
        Validators.maxLength(10),
      ]),
      _correo: new FormControl("", [Validators.email]),
      _tipoDocumento: new FormControl("", [Validators.required]),
      _tipoTelefono1: new FormControl("", [Validators.required]),
      _tipoTelefono2: new FormControl("", [Validators.required]),
      _provincia: new FormControl("", [Validators.required]),
      _canton: new FormControl("", [Validators.required]),
      _parroquia: new FormControl("", [Validators.required]),
      _idCorreo: new FormControl(""),
      _idAsignacionPersonaParroquia: new FormControl(""),
      _idPersona: new FormControl(""),
      _idTelefono1: new FormControl(""),
      _idTelefono2: new FormControl(""),
    });
  }

  @Input() llamadaModal = "false";

  get _correo() {
    return this.myForm.get("_correo");
  }

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  personas = new MatTableDataSource<Element[]>();

  myForm: FormGroup;
  botonInsertar = "insertar";
  contacto = "Contacto ";
  direccion = "Direccion";
  filterPersona = "";
  guardar = "Guardar";
  nuevaPersona = "Nueva Persona";

  cantones: any[] = [];
  parroquias: any[] = [];
  personaModal: any = {};
  provincias: any[] = [];
  telefonos: any[] = [];
  tipoDocumentos: any[] = [];
  tipoTelefonos: any[] = [];

  consultarProvincias() {
    this.panelAdministracionService
      .consultarProvincias()
      .then((ok) => {
        this.provincias = ok["respuesta"];
      })
      .catch((error) => console.log(error));
  }

  async consultarPersonas() {
    var respuesta = await this.personaService.consultarPersonas();
    console.log(respuesta);
    if (respuesta["codigo"] == "200") {
      var personas: any = [];
      respuesta["respuesta"].map((persona) => {
        persona.Acciones = this.llamadaModal;
        personas.push(persona);
      });
      this.personas.data = personas;
      this.personas.paginator = this.paginator;
    }
  }

  consultarTipoDocumento() {
    this.personaService
      .consultarTipoDocumento()
      .then((ok) => {
        this.tipoDocumentos = ok["respuesta"];
      })
      .catch((error) => console.log(error));
  }

  consultarTipoTelefono() {
    this.personaService
      .consultarTipoTelefono()
      .then((ok) => {
        this.tipoTelefonos = ok["respuesta"];
      })
      .catch((error) => console.log(error));
  }

  consultarCantonesDeUnaProvincia(idProvincia: string, value?: string) {
    this.cantones = [];
    this.parroquias = [];
    this.panelAdministracionService
      .consultarCantonesDeUnaProvincia(idProvincia)
      .then((ok) => {
        this.cantones = ok["respuesta"];
        if (value == "ingresar") {
          this.myForm.get("_canton").setValue("0");
          this.myForm.get("_parroquia").setValue("0");
          this.parroquias = null;
        }
      })
      .catch((error) => console.log(error));
  }

  consultarParroquiasDeUnCanton(idCanton: string, value?: string) {
    this.parroquias = [];
    this.panelAdministracionService
      .consultarParroquiasDeUnCanton(idCanton)
      .then((ok) => {
        this.parroquias = ok["respuesta"];
        if (value == "ingresar") {
          this.myForm.get("_parroquia").setValue("0");
        }
      })
      .catch((error) => console.log(error));
  }

  validarNombres(validarDosNombres) {
    var arrayNombres = this.myForm.get("_nombres").value.split(" ");
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
    var arrayApellidos = this.myForm.get("_apellidos").value.split(" ");
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
      if (this.botonInsertar == "insertar") {
        this.crearPersona();
      } else if (this.botonInsertar == "modificar") {
        this.actualizarPersona();
      }
    }
  }

  async crearPersona() {
    var validarNombress = {
      primerCampo: "",
      segundoCampo: "",
      valido: Boolean,
    };
    var validarApellidos = {
      primerCampo: "",
      segundoCampo: "",
      valido: Boolean,
    };
    var dosNombres = this.validarNombres(validarNombress);
    var dosApellidos = this.validarApellidos(validarApellidos);
    if (dosNombres.valido == true && dosApellidos.valido == true) {
      var respuesta = await this.personaService.crearPersona(
        this.myForm.get("_numeroDocumento").value,
        this.myForm.get("_tipoDocumento").value,
        dosApellidos.primerCampo,
        dosApellidos.segundoCampo,
        dosNombres.primerCampo,
        dosNombres.segundoCampo,
        this.myForm.get("_telefono1").value,
        this.myForm.get("_tipoTelefono1").value,
        this.myForm.get("_telefono2").value,
        this.myForm.get("_tipoTelefono2").value,
        this.myForm.get("_correo").value,
        this.myForm.get("_parroquia").value
      );
      console.log(respuesta);
      if(respuesta["codigo"] == "200") {
        var personas: any = this.personas.data;
        respuesta["respuesta"].Acciones = this.llamadaModal;
        personas.push(respuesta["respuesta"]);
        this.personas.data = personas;
      }
    }
  }

  abrirModal(persona) {
    let dialogRef = this.dialog.open(ModalDetallePersonaComponent, {
      width: "500px",
      height: "auto",
      data: {
        persona: persona,
      },
    });
  }

  mostrarPersona(persona) {
    console.log(persona);
    
    this.nuevaPersona = "Modificar Persona";
    this.contacto = "Modificar Contacto";
    this.direccion = "Modificar Direccion";
    this.guardar = "Modificar";
    this.myForm.get("_idPersona").setValue(persona.IdPersona);
    var nombres = persona.PrimerNombre + " " + persona.SegundoNombre;
    var apellidos = persona.ApellidoPaterno + " " + persona.ApellidoMaterno;
    if (persona.ListaCorreo == null) {
      this.myForm.get("_correo").setValue("");
    } else {
      this.myForm.get("_idCorreo").setValue(persona.ListaCorreo[0].IdCorreo);
      this.myForm.get("_correo").setValue(persona.ListaCorreo[0].CorreoValor);
    }
    this.myForm.get("_nombres").setValue(nombres);
    this.myForm.get("_apellidos").setValue(apellidos);
    this.myForm.get("_tipoDocumento").setValue(persona.IdTipoDocumento);
    this.myForm.get("_numeroDocumento").setValue(persona.NumeroDocumento);
    this.myForm
      .get("_idTelefono1")
      .setValue(persona.ListaTelefono[0].IdTelefono);
    this.myForm.get("_telefono1").setValue(persona.ListaTelefono[0].Numero);
    this.myForm
      .get("_tipoTelefono1")
      .setValue(persona.ListaTelefono[0].TipoTelefono.IdTipoTelefono);
    this.myForm
      .get("_idTelefono2")
      .setValue(persona.ListaTelefono[1].IdTelefono);
    this.myForm.get("_telefono2").setValue(persona.ListaTelefono[1].Numero);
    this.myForm
      .get("_tipoTelefono2")
      .setValue(persona.ListaTelefono[1].TipoTelefono.IdTipoTelefono);
    this.myForm
      .get("_provincia")
      .setValue(
        persona.AsignacionPersonaParroquia[0].Parroquia.Canton.Provincia
          .IdProvincia
      );
    this.consultarCantonesDeUnaProvincia(
      this.myForm.get("_provincia").value,
      ""
    );
    this.myForm
      .get("_canton")
      .setValue(
        persona.AsignacionPersonaParroquia[0].Parroquia.Canton.IdCanton
      );
    this.consultarParroquiasDeUnCanton(this.myForm.get("_canton").value, "");
    this.myForm
      .get("_parroquia")
      .setValue(persona.AsignacionPersonaParroquia[0].Parroquia.IdParroquia);
    this.myForm
      .get("_idAsignacionPersonaParroquia")
      .setValue(persona.AsignacionPersonaParroquia[0].IdAsignacionPC);
    this.botonInsertar = "modificar";
  }

  actualizarPersona() {
    var validarNombress = {
      primerCampo: "",
      segundoCampo: "",
      valido: Boolean,
    };
    var validarApellidos = {
      primerCampo: "",
      segundoCampo: "",
      valido: Boolean,
    };
    var dosNombres = this.validarNombres(validarNombress);
    var dosApellidos = this.validarApellidos(validarApellidos);
    if (dosNombres.valido == true && dosApellidos.valido == true) {
      this.personaService
        .actualizarPersona(
          this.myForm.get("_idPersona").value,
          this.myForm.get("_numeroDocumento").value,
          this.myForm.get("_tipoDocumento").value,
          dosApellidos.primerCampo,
          dosApellidos.segundoCampo,
          dosNombres.primerCampo,
          dosNombres.segundoCampo
        )
        .then((ok) => {
          if (ok["respuesta"] == "false") {
            sweetAlert("Cédula ya existe!", {
              icon: "warning",
            });
          } else if (ok["respuesta"] == "400") {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
          } else {
            this.actualizarTelefono();
          }
        })
        .catch((error) => console.log(error));
    }
  }

  actualizarTelefono() {
    this.telefonos.push(
      {
        IdPersona: this.myForm.get("_idPersona").value,
        IdTelefono: this.myForm.get("_idTelefono1").value,
        Numero: this.myForm.get("_telefono1").value,
        IdTipoTelefono: this.myForm.get("_tipoTelefono1").value,
      },
      {
        IdPersona: this.myForm.get("_idPersona").value,
        IdTelefono: this.myForm.get("_idTelefono2").value,
        Numero: this.myForm.get("_telefono2").value,
        IdTipoTelefono: this.myForm.get("_tipoTelefono2").value,
      }
    );
    this.telefonos.map((item) => {
      this.personaService
        .actualizarTelefono(
          item.IdPersona,
          item.IdTelefono,
          item.Numero,
          item.IdTipoTelefono
        )
        .then((ok) => {
          if (ok["respuesta"]) {
            this.actualizarCorreo(
              this.myForm.get("_idPersona").value,
              this.myForm.get("_idCorreo").value
            );
          } else {
            sweetAlert("Ha ocurrido un error!", {
              icon: "error",
            });
          }
        })
        .catch((error) => console.log(error));
    });
  }

  actualizarCorreo(idPersona: string, idCorreo: string) {
    this.personaService
      .actualizarCorreo(idPersona, idCorreo, this.myForm.get("_correo").value)
      .then((ok) => {
        if (ok["respuesta"]) {
          this.actualizarDireccion(
            this.myForm.get("_idPersona").value,
            this.myForm.get("_idAsignacionPersonaParroquia").value
          );
        } else {
          sweetAlert("Ha ocurrido un error!", {
            icon: "error",
          });
        }
      })
      .catch((error) => console.log(error));
  }

  actualizarDireccion(idPersona: string, idAsignacionPC: string) {
    this.personaService
      .actualizarDireccion(
        idPersona,
        idAsignacionPC,
        this.myForm.get("_parroquia").value
      )
      .then((ok) => {
        if (ok["respuesta"]) {
          this.myForm.reset();
          this.botonInsertar = "insertar";
          this.consultarPersonas();
          this.nuevaPersona = "Nueva Persona";
          this.contacto = "Contacto ";
          this.direccion = "Direccion";
          this.guardar = "Guardar";
          sweetAlert("Se actualizó correctamente!", {
            icon: "success",
          });
        } else {
          sweetAlert("Ha ocurrido un error!", {
            icon: "error",
          });
        }
      })
      .catch((error) => console.log(error));
  }

  @Output() obtenerPersona = new EventEmitter();
  seleccionarPersona(persona) {
    this.obtenerPersona.emit(persona);
  }

  cancelar() {
    this.myForm.reset();
  }

  ngOnInit() {
    this.consultarPersonas();
    this.consultarTipoDocumento();
    this.consultarTipoTelefono();
    this.consultarProvincias();
  }

  tablaPersonas = [
    "nombres",
    "apellidos",
    "documento",
    "numeroDocumento",
    "acciones",
  ];
  matcher = new MyErrorStateMatcher();
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
