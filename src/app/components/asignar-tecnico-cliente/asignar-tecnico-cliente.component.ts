import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { PanelAdministracionService } from "src/app/services/panel-administracion.service";
import { UsuarioService } from "src/app/services/usuario.service";
import { VentaService } from "src/app/services/venta.service";
import { MatPaginator, MatTableDataSource } from "@angular/material";

@Component({
  selector: "app-asignar-tecnico-cliente",
  templateUrl: "./asignar-tecnico-cliente.component.html",
  styleUrls: ["./asignar-tecnico-cliente.component.css"],
})
export class AsignarTecnicoClienteComponent implements OnInit {
  constructor(
    private panelAdministracionService: PanelAdministracionService,
    private usuarioService: UsuarioService,
    private ventaService: VentaService
  ) {
    this.myForm = new FormGroup({
      _canton: new FormControl(""),
      _parroquia: new FormControl(""),
      _comunidad: new FormControl(""),
      _idTecnico: new FormControl(""),
    });
  }

  myForm: FormGroup;
  cantones: any[] = [];
  parroquias: any[] = [];
  comunidades: any[] = [];
  tecnicos: any[] = [];

  consultarCantones() {
    this.panelAdministracionService
      .consultarCantones(localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        this.cantones = [];
        this.cantones = ok["respuesta"];
        this.myForm.get("_parroquia").setValue("0");
        this.myForm.get("_comunidad").setValue("0");
      })
      .catch((error) => console.log(error));
  }

  consultarParroquiasDeUnCanton(idCanton) {
    const url = "Credito/ConsultarPersonasEnFacturasParaSeguimientoPorCanton";
    this.panelAdministracionService
      .consultarParroquiasDeUnCanton(
        idCanton,
        localStorage.getItem("miCuenta.getToken")
      )
      .then((ok) => {
        this.parroquias = [];
        this.parroquias = ok["respuesta"];
        this.myForm.get("_comunidad").setValue("0");
        this.consultarClientes(idCanton, "IdCanton", url);
      })
      .catch((error) => console.log(error));
  }

  consultarComunidadesDeUnaParroquia(idParroquia) {
    const url =
      "Credito/ConsultarPersonasEnFacturasParaSeguimientoPorParroquia";
    this.panelAdministracionService
      .consultarComunidadesDeUnaParroquia(
        idParroquia,
        localStorage.getItem("miCuenta.getToken")
      )
      .then((ok) => {
        this.comunidades = [];
        this.comunidades = ok["respuesta"];
        this.consultarClientes(idParroquia, "IdParroquia", url);
      })
      .catch((error) => console.log(error));
  }

  consultarClientesDeUnaComunidad(idComunidad) {
    const url = "Credito/ConsultarPersonasParaSeguimientoPorComunidad";
    this.consultarClientes(idComunidad, "IdComunidad", url);
  }

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  clientes = new MatTableDataSource<Element[]>();

  consultarClientes(idLocalidad, localidad, url) {
    this.ventaService
      .filtroClientes(
        url,
        idLocalidad,
        localidad,
        localStorage.getItem("miCuenta.getToken")
      )
      .then((ok) => {
        var clientes = [];
        ok["respuesta"].map((cliente) => {
          clientes.push({
            _id: cliente.IdPersona,
            cedula: cliente.NumeroDocumento,
            nombres:
              cliente.PrimerNombre +
              " " +
              cliente.SegundoNombre +
              " " +
              cliente.ApellidoPaterno +
              " " +
              cliente.ApellidoMaterno,
          });
        });
        this.clientes.data = clientes;
        this.clientes.paginator = this.paginator;
      })
      .catch((error) => console.log(error));
  }

  consultarTipoUsuario() {
    this.usuarioService
      .consultarTipoUsuario(localStorage.getItem("miCuenta.getToken"))
      .then((ok) => {
        ok["respuesta"].map((item) => {
          if (item.Identificacion === "3") {
            this.consultarTecnicos(item.IdTipoUsuario);
          }
        });
      })
      .catch((error) => console.log(error));
  }

  consultarTecnicos(idTipoUsuario) {
    this.usuarioService
      .consultarTecnicos(
        idTipoUsuario,
        localStorage.getItem("miCuenta.getToken")
      )
      .then((ok) => {
        this.tecnicos = [];
        ok["respuesta"].map((tecnico) => {
          this.tecnicos.push({
            _id: tecnico.AsignacionTipoUsuario.IdAsignacionTUEncriptada,
            nombres:
              tecnico.PrimerNombre +
              " " +
              tecnico.SegundoNombre +
              " " +
              tecnico.ApellidoPaterno +
              " " +
              tecnico.ApellidoMaterno,
          });
        });
      })
      .catch((error) => console.log(error));
  }

  clientesAsignados(idTecnico) {
    this.myForm.get("_idTecnico").setValue(idTecnico);
  }

  asignarClienteTecnico(idPersona) {
    if (this.myForm.get("_idTecnico").value != "") {
      this.ventaService
        .asignarClienteTecnico(
          this.myForm.get("_idTecnico").value,
          idPersona,
          localStorage.getItem("miCuenta.postToken")
        )
        .then((ok) => {
          console.log(ok["respuesta"]);
        })
        .catch((error) => console.log(error));
    } else {
      sweetAlert("Necesitas un técnnico", { icon: "warning" });
    }
  }

  desasignarClienteTecnico(idPersona) {}

  ngOnInit() {
    this.consultarCantones();
    this.consultarTipoUsuario();
  }

  tablaCantones = ["cedula", "cliente", "acciones"];
}
