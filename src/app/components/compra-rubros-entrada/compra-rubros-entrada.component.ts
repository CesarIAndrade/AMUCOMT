import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import { RubrosService } from "src/app/services/rubros.service";
import { FormGroup, FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { startWith, map, throwIfEmpty } from "rxjs/operators";
import { ModalPersonaComponent } from "../modal-persona/modal-persona.component";
import { MatDialog, MatTableDataSource, MatPaginator } from "@angular/material";
import { openDialog } from "src/app/functions/global";
import { ModalTicketFinalizadoComponent } from "../modal-ticket-finalizado/modal-ticket-finalizado.component";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";

@Component({
  selector: "app-compra-rubros-entrada",
  templateUrl: "./compra-rubros-entrada.component.html",
  styleUrls: ["./compra-rubros-entrada.component.css"],
})
export class CompraRubrosEntradaComponent implements OnInit {
  myForm: FormGroup;
  constructor(private rubrosService: RubrosService, private dialog: MatDialog) {
    this.myForm = new FormGroup({
      _idRubro: new FormControl(""),
      _rubro: new FormControl(""),
      _idPresentacionRubro: new FormControl(""),
      _presentacionRubro: new FormControl(""),
      _identificadorPresentacion: new FormControl(""),
      _placaVehiculo: new FormControl(""),
      _cliente: new FormControl(""),
      _idCliente: new FormControl(""),
      _peso: new FormControl(""),
      // Solo para saco
      _porcentajeHumedad: new FormControl(""),
      _precioPorQuintal: new FormControl(""),
      _porcentajeImpureza: new FormControl(""),
    });
  }

  rubros: any[] = [];
  presentacionRubros: any[] = [];
  placas: any[] = [];
  filteredOptions: Observable<string[]>;
  placasSeleccionables: any[] = [];
  carro = false;
  medida: string;
  tipoPeso: string;

  loading = true;
  compraPorSaco = false;
  despuesDeSeleccionarPresentacion = false;

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  tickets = new MatTableDataSource<Element[]>();

  opciones = [
    {
      _id: "1",
      descripcion: "Compras Pendientes",
      checked: true,
    },
    {
      _id: "2",
      descripcion: "Compras finalizadas",
      checked: false,
    },
  ];

  selecionarOpcion(opcion) {
    this.tickets.data = [];
    if (opcion._id === "1") {
      this.loading = true;
      this.tablaTickets = ["codigo", "rubro", "placa", "pesoBruto", "acciones"];
      this.consultarTickets();
      this.consultarPlacas();
    } else if (opcion._id === "2") {
      this.loading = true;
      this.tablaTickets = [
        "codigo",
        "rubro",
        "presentacion",
        "pesoNeto",
        "total",
        "acciones",
      ];
      this.consultarComprasRubros();
    }
  }

  async consultarRubros() {
    var respuesta = await this.rubrosService.consultarRubros();
    if (respuesta["codigo"] == "200") {
      this.rubros = respuesta["respuesta"];
    }
  }

  async consultarPresentacionRubros() {
    var respuesta = await this.rubrosService.consultarPresentacionRubros();
    if (respuesta["codigo"] == "200") {
      this.presentacionRubros = respuesta["respuesta"];
    }
  }

  async consultarTickets() {
    var respuesta = await this.rubrosService.consultarTickets(
      "ConsultarTicket"
    );
    if (respuesta["codigo"] == "200") {
      this.loading = false;
      var temp_respuesta: any = [];
      respuesta["respuesta"].map((item) => {
        item.Finalizado = false;
        item.Placa = item._Vehiculo.Placa;
        temp_respuesta.push(item);
      });
      this.tickets.data = temp_respuesta;
      this.tickets.paginator = this.paginator;
    }
  }

  async consultarPlacas() {
    var respuesta = await this.rubrosService.consultarPlacas();
    if (respuesta["codigo"] == "200") {
      this.placas = respuesta["respuesta"];
      this.placasSeleccionables = this.placas;
      this.filteredOptions = this.myForm
        .get("_placaVehiculo")
        .valueChanges.pipe(
          startWith(""),
          map((value) => this._filter(value))
        );
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value;
    return this.placasSeleccionables.filter((option) =>
      option.Placa.toLowerCase().includes(filterValue)
    );
  }

  async consultarComprasRubros() {
    var respuesta = await this.rubrosService.consultarComprasOVentasRubros(
      "ConsultarTicketFinalizados"
    );
    if (respuesta["codigo"] == "200") {
      this.loading = false;
      var temp_respuesta: any = [];
      respuesta["respuesta"].map((item) => {
        item.Finalizado = true;
        temp_respuesta.push(item);
      });
      this.tickets.data = temp_respuesta;
    }
  }

  seleccionarPersona() {
    let dialogRef = this.dialog.open(ModalPersonaComponent, {
      width: "auto",
      height: "auto",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.myForm.get("_idCliente").setValue(result.idPersona);
        var nombres = result.nombres + " " + result.apellidos;
        this.myForm.get("_cliente").setValue(nombres);
      }
    });
  }

  selecionarRubro(rubro) {
    this.myForm.get("_idRubro").setValue(rubro.value);
  }

  limpiarCampos() {
    this.myForm.get("_placaVehiculo").reset();
    this.myForm.get("_cliente").reset();
    this.myForm.get("_idCliente").reset();
    this.myForm.get("_peso").reset();
    this.myForm.get("_porcentajeHumedad").reset();
    this.myForm.get("_precioPorQuintal").reset();
    this.myForm.get("_porcentajeImpureza").reset();
  }

  seleccionarPresentacionRubros(presentacionRubro) {
    this.limpiarCampos();
    this.despuesDeSeleccionarPresentacion = true;
    this.myForm.get("_idPresentacionRubro").setValue(presentacionRubro.value);
    var respuesta = this.presentacionRubros.find(
      (item) => item.IdTipoPresentacionRubro == presentacionRubro.value
    );
    if (respuesta.Descripcion == "CARRO") {
      this.tipoPeso = "Bruto";
      this.medida = "kg";
      this.carro = true;
      this.compraPorSaco = false;
      this.rubrosService.encabezadoTabs = "Carro";
      this.rubrosService.encabezadoTabsEvent$.emit();
    } else if (respuesta.Descripcion == "SACO") {
      this.tipoPeso = "Neto";
      this.medida = "q";
      this.carro = false;
      this.compraPorSaco = true;
      this.rubrosService.encabezadoTabs = "";
      this.rubrosService.encabezadoTabsEvent$.emit();
    }
    this.myForm
      .get("_identificadorPresentacion")
      .setValue(respuesta.Identificador);
  }

  async crearTicket() {
    this.loading = true;
    this.tickets.data = [];
    var respuesta = await this.rubrosService.crearTicket(
      this.myForm.get("_idPresentacionRubro").value,
      this.myForm.get("_identificadorPresentacion").value,
      this.myForm.get("_idRubro").value,
      this.myForm.get("_placaVehiculo").value,
      localStorage.getItem("miCuenta.idAsignacionTipoUsuario"),
      this.myForm.get("_idCliente").value,
      this.myForm.get("_placaVehiculo").value ? "PesoBruto" : "PesoNeto",
      this.myForm.get("_peso").value,
      this.myForm.get("_porcentajeHumedad").value,
      this.myForm.get("_precioPorQuintal").value,
      this.myForm.get("_porcentajeImpureza").value
    );
    if (respuesta["codigo"] == "200") {
      this.consultarPlacas();
      this.consultarTickets();
      this.compraPorSaco = false;
      this.despuesDeSeleccionarPresentacion = false;
      this.carro = false;
      if (!this.myForm.get("_placaVehiculo").value) {
        this.dialog.open(ModalTicketFinalizadoComponent, {
          width: "auto",
          height: "auto",
          data: {
            ticket: respuesta["respuesta"],
            ruta: "compra",
          },
        });
      }
      this.myForm.reset();
    } else if (respuesta["codigo"] == "418") {
      openDialog(respuesta["mensaje"], "advertencia", this.dialog);
    }
  }

  async eliminarTicket(idTicket) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "250px",
      height: "auto",
      data: {
        mensaje: "",
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.loading = true;
        this.tickets.data = [];
        var respuesta = await this.rubrosService.eliminarTicket(
          idTicket,
          "IdTicket",
          "EliminarTicket"
        );
        if (respuesta["codigo"] == "200") {
          this.consultarPlacas();
          this.consultarTickets();
        }
      }
    });
  }

  @Output() finalizarTicketEvent = new EventEmitter();
  finalizarTicket(idTicket) {
    this.rubrosService.idTicket = idTicket;
    this.rubrosService.refresh$.emit();
    this.finalizarTicketEvent.emit();
  }

  async anularCompra(idTicket) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "250px",
      height: "auto",
      data: {
        mensaje: "",
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.loading = true;
        this.tickets.data = [];
        var respuesta = await this.rubrosService.anularCompra(
          idTicket,
          "IdTicket",
          localStorage.getItem("miCuenta.idAsignacionTipoUsuario"),
          "AnularTicket"
        );
        if (respuesta["codigo"] == "200") {
          this.loading = false;
          this.consultarComprasRubros();
        }
      }
    });
  }

  reimprimirComprobante(ticket) {
    this.dialog.open(ModalTicketFinalizadoComponent, {
      width: "auto",
      height: "auto",
      data: {
        ticket,
        ruta: "compra",
      },
    });
  }

  search(term: string) {
    term = term.trim();
    term = term.toUpperCase();
    this.tickets.filter = term;
  }

  ngOnInit() {
    this.consultarRubros();
    this.consultarPresentacionRubros();
    this.consultarPlacas();
    this.consultarTickets();
    // this.consultarComprasRubros();
    this.rubrosService.refresh$.subscribe(() => {
      this.consultarPlacas();
      this.consultarTickets();
      // this.consultarComprasRubros();
    });
  }

  tablaTickets = ["codigo", "rubro", "placa", "pesoBruto", "acciones"];
}
