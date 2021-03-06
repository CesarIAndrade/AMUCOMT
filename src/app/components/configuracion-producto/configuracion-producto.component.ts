import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { salir, openDialog, openSnackBar } from "../../functions/global";
import { Router } from "@angular/router";

// Components
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";

// Material
import {
  MatTableDataSource,
  MatPaginator,
  MatDialog,
  MatSnackBar,
} from "@angular/material";

// Services
import { InventarioService } from "src/app/services/inventario.service";

@Component({
  selector: "app-configuracion-producto",
  templateUrl: "./configuracion-producto.component.html",
  styleUrls: ["./configuracion-producto.component.css"],
})
export class ConfiguracionProductoComponent implements OnInit {
  constructor(
    private inventarioService: InventarioService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.myForm = new FormGroup({
      _campo: new FormControl("", [Validators.required]),
      _idCampo: new FormControl(""),
      // Solo para kit
      _idKit: new FormControl(""),
      _codigo: new FormControl(""),
      _descuento: new FormControl(""),
      _idDescuento: new FormControl(""),
      // Solo para intereses
      _idInteres: new FormControl(""),
      _interes: new FormControl(""),
      _tasaInteres: new FormControl(""),
      _idInteresMora: new FormControl(""),
      _interesMora: new FormControl(""),
      _tasaInteresMora: new FormControl(""),
    });
  }

  myForm: FormGroup;
  filter = "";
  titulo: string;
  suffix: string;
  encabezadoTabla: string;
  mostrarForm = true;
  soloParaKits = false;
  loading = false;
  ocultarCampoCuandoIntereses = false;
  mostrarSeccionCuandoIntereses = true;
  botonIngresar = "ingresar";

  opciones = [
    {
      _id: "1",
      descripcion: "Tipo Producto",
      checked: true,
    },
    {
      _id: "2",
      descripcion: "Presentaciones",
      checked: false,
    },
    {
      _id: "3",
      descripcion: "Medidas",
      checked: false,
    },
    {
      _id: "4",
      descripcion: "Kits",
      checked: false,
    },
    {
      _id: "5",
      descripcion: "Intereses",
      checked: false,
    },
  ];
  descuentos: any[] = [];
  filteredOptions: Observable<string[]>;

  // PAra la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  dataSource = new MatTableDataSource<Element[]>();

  async consultarTipoProductos() {
    var respuesta = await this.inventarioService.consultarTipoProductos();
    if (respuesta["codigo"] == "200") {
      this.loading = false;
      var tipoProductos = [];
      respuesta["respuesta"].map((item) => {
        tipoProductos.push({
          _id: item.IdTipoProducto,
          descripcion: item.Descripcion,
          utilizado: item.TipoProductoUtilizado,
          estado: item.estado,
          mostrar: false,
        });
        this.dataSource.data = tipoProductos;
        this.dataSource.paginator = this.paginator;
      });
    } else if (respuesta["codigo"] == "403") {
      openDialog("Sesión Caducada", "advertencia", this.dialog);
      this.router.navigateByUrl(salir());
    }
  }

  async crearTipoProducto() {
    var tipoProducto = await this.inventarioService.crearTipoProducto(
      this.myForm.get("_campo").value
    );
    if (tipoProducto["codigo"] == "200") {
      openSnackBar("Se ingresó correctamente", this.snackBar);
      var tipoProductos: any = this.dataSource.data;
      tipoProductos.push({
        _id: tipoProducto["respuesta"].IdTipoProducto,
        descripcion: tipoProducto["respuesta"].Descripcion,
        utilizado: tipoProducto["respuesta"].TipoProductoUtilizado,
        estado: tipoProducto["respuesta"].estado,
      });
      this.dataSource.data = tipoProductos;
      this.myForm.get("_campo").reset();
    } else if (tipoProducto["codigo"] == "400") {
      openDialog("Inténtalo de nuevo", "advertencia", this.dialog);
    } else if (tipoProducto["codigo"] == "418") {
      openDialog(tipoProducto["mensaje"], "advertencia", this.dialog);
    } else if (tipoProducto["codigo"] == "500") {
      openDialog("Problemas con el servidor", "advertencia", this.dialog);
    }
  }

  eliminarTipoProducto(idTipoProducto) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "250px",
      height: "auto",
      data: {
        mensaje: "",
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        var respuesta = await this.inventarioService.eliminarTipoProducto(
          idTipoProducto
        );
        if (respuesta["codigo"] == "200") {
          openSnackBar("Se eliminó correctamente", this.snackBar);
          var tipoProductos: any = this.dataSource.data;
          var tipoProducto = tipoProductos.find(
            (tipoProducto) => tipoProducto["_id"] == idTipoProducto
          );
          var index = tipoProductos.indexOf(tipoProducto);
          tipoProductos.splice(index, 1);
          this.dataSource.data = tipoProductos;
        } else if (respuesta["codigo"] == "400") {
          openDialog("Inténtalo de nuevo", "advertencia", this.dialog);
        } else if (respuesta["codigo"] == "418") {
          openDialog(respuesta["mensaje"], "advertencia", this.dialog);
        } else if (respuesta["codigo"] == "500") {
          openDialog("Problemas con el servidor", "advertencia", this.dialog);
        }
      }
    });
  }

  async consultarPresentaciones() {
    var respuesta = await this.inventarioService.consultarPresentaciones();
    if (respuesta["codigo"] == "200") {
      this.loading = false;
      var presentaciones: any = [];
      respuesta["respuesta"].map((item) => {
        presentaciones.push({
          _id: item.IdPresentacion,
          descripcion: item.Descripcion,
          utilizado: item.PresentacionUtilizado,
          estado: item.Estado,
        });
      });
      this.dataSource.data = presentaciones;
      this.dataSource.paginator = this.paginator;
    }
  }

  async crearPresentacion() {
    var presentacion = await this.inventarioService.crearPresentacion(
      this.myForm.get("_campo").value
    );
    if (presentacion["codigo"] == "200") {
      openSnackBar("Se ingresó correctamente", this.snackBar);
      var presentaciones: any = this.dataSource.data;
      presentaciones.push({
        _id: presentacion["respuesta"].IdPresentacion,
        descripcion: presentacion["respuesta"].Descripcion,
        utilizado: presentacion["respuesta"].PresentacionUtilizado,
        estado: presentacion["respuesta"].Estado,
      });
      this.dataSource.data = presentaciones;
      this.myForm.get("_campo").reset();
    } else if (presentacion["codigo"] == "400") {
      openDialog("Inténtalo de nuevo", "advertencia", this.dialog);
    } else if (presentacion["codigo"] == "418") {
      openDialog(presentacion["mensaje"], "advertencia", this.dialog);
    } else if (presentacion["codigo"] == "500") {
      openDialog("Problemas con el servidor", "advertencia", this.dialog);
    }
  }

  async eliminarPresentacion(idPresentacion) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "250px",
      height: "auto",
      data: {
        mensaje: "",
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        var respuesta = await this.inventarioService.eliminarPresentacion(
          idPresentacion
        );
        if (respuesta["codigo"] == "200") {
          openSnackBar("Se eliminó correctamente", this.snackBar);
          var presentaciones: any = this.dataSource.data;
          var presentacion = presentaciones.find(
            (presentacion) => presentacion["_id"] == idPresentacion
          );
          var index = presentaciones.indexOf(presentacion);
          presentaciones.splice(index, 1);
          this.dataSource.data = presentaciones;
        } else if (respuesta["codigo"] == "400") {
          openDialog("Inténtalo de nuevo", "advertencia", this.dialog);
        } else if (respuesta["codigo"] == "418") {
          openDialog(respuesta["mensaje"], "advertencia", this.dialog);
        } else if (respuesta["codigo"] == "500") {
          openDialog("Problemas con el servidor", "advertencia", this.dialog);
        }
      }
    });
  }

  async consultarMedidas() {
    var respuesta = await this.inventarioService.consultarMedidas();
    if (respuesta["codigo"] == "200") {
      this.loading = false;
      var medidas: any = [];
      respuesta["respuesta"].map((item) => {
        medidas.push({
          _id: item.IdMedida,
          descripcion: item.Descripcion,
          utilizado: item.MedidaUtilizado,
          estado: item.Estado,
        });
      });
      this.dataSource.data = medidas;
      this.dataSource.paginator = this.paginator;
    }
  }

  async crearMedida() {
    var medida = await this.inventarioService.crearMedida(
      this.myForm.get("_campo").value
    );
    if (medida["codigo"] == "200") {
      openSnackBar("Se ingresó correctamente", this.snackBar);
      var medidas: any = this.dataSource.data;
      medidas.push({
        _id: medida["respuesta"].IdMedida,
        descripcion: medida["respuesta"].Descripcion,
        utilizado: medida["respuesta"].MedidaUtilizado,
        estado: medida["respuesta"].Estado,
      });
      this.dataSource.data = medidas;
      this.myForm.get("_campo").reset();
    } else if (medida["codigo"] == "400") {
      openDialog("Inténtalo de nuevo", "advertencia", this.dialog);
    } else if (medida["codigo"] == "418") {
      openDialog(medida["mensaje"], "advertencia", this.dialog);
    } else if (medida["codigo"] == "500") {
      openDialog("Problemas con el servidor", "advertencia", this.dialog);
    }
  }

  eliminarMedida(idMedida) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "250px",
      height: "auto",
      data: {
        mensaje: "",
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        var respuesta = await this.inventarioService.eliminarMedida(idMedida);
        if (respuesta["codigo"] == "200") {
          openSnackBar("Se eliminó correctamente", this.snackBar);
          var medidas: any = this.dataSource.data;
          var medida = medidas.find((medida) => medida["_id"] == idMedida);
          var index = medidas.indexOf(medida);
          medidas.splice(index, 1);
          this.dataSource.data = medidas;
        } else if (respuesta["codigo"] == "400") {
          openDialog("Inténtalo de nuevo", "advertencia", this.dialog);
        } else if (respuesta["codigo"] == "418") {
          openDialog(respuesta["mensaje"], "advertencia", this.dialog);
        } else if (respuesta["codigo"] == "500") {
          openDialog("Problemas con el servidor", "advertencia", this.dialog);
        }
      }
    });
  }

  async consultarKits() {
    var respuesta = await this.inventarioService.consultarKits();
    if (respuesta["codigo"] == "200") {
      this.loading = false;
      var kits: any = [];
      respuesta["respuesta"].map((item) => {
        kits.push({
          _id: item.IdKit,
          descripcion: item.Descripcion,
          utilizado: item.KitUtilizado,
          codigo: item.Codigo,
          descuento: item.AsignarDescuentoKit.Descuento.Porcentaje,
          estado: item.Estado,
        });
      });
      this.dataSource.data = kits;
      this.dataSource.paginator = this.paginator;
    }
  }

  async crearKit() {
    if (this.myForm.get("_descuento").value % 1 === 0) {
      var kit = await this.inventarioService.crearKit(
        this.myForm.get("_campo").value,
        this.myForm.get("_codigo").value,
        this.myForm.get("_descuento").value
      );
      if (kit["codigo"] == "200") {
        openSnackBar("Se ingresó correctamente", this.snackBar);
        var kits: any = this.dataSource.data;
        kits.push({
          _id: kit["respuesta"].IdKit,
          descripcion: kit["respuesta"].Descripcion,
          utilizado: kit["respuesta"].KitUtilizado,
          codigo: kit["respuesta"].Codigo,
          descuento: kit["respuesta"].AsignarDescuentoKit.Descuento.Porcentaje,
          estado: kit["respuesta"].Estado,
        });
        this.dataSource.data = kits;
        this.limpiarCampos();
      } else if (kit["codigo"] == "400") {
        openDialog("Inténtalo de nuevo", "advertencia", this.dialog);
      } else if (kit["codigo"] == "418") {
        openDialog(kit["mensaje"], "advertencia", this.dialog);
      } else if (kit["codigo"] == "500") {
        openDialog("Problemas con el servidor", "advertencia", this.dialog);
      }
    } else {
      openDialog("El descuento debe ser entero", "advertencia", this.dialog);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = String(value).toLowerCase();
    return this.descuentos.filter((option) =>
      option.Porcentaje.toLowerCase().includes(filterValue)
    );
  }

  async consultarDescuentos() {
    var respuesta = await this.inventarioService.consultarDescuentos();
    if (respuesta["codigo"] == "200") {
      respuesta["respuesta"].map((descuento) => {
        this.descuentos.push({
          IdDescuento: descuento.IdDescuento,
          Porcentaje: String(descuento.Porcentaje),
        });
      });
      this.filteredOptions = this.myForm.get("_descuento").valueChanges.pipe(
        startWith(""),
        map((value) => this._filter(value))
      );
    }
  }

  seleccionarDescuentoSiExiste(descuento) {
    this.myForm.get("_descuento").setValue(descuento);
  }

  mostrarKit(kit) {
    this.botonIngresar = "modificar";
    this.myForm.get("_idKit").setValue(kit._id);
    this.myForm.get("_campo").setValue(kit.descripcion);
    this.myForm.get("_codigo").setValue(kit.codigo);
    this.myForm.get("_descuento").setValue(kit.descuento);
    if (kit.utilizado == "1") {
      this.myForm.get("_campo").disable();
      this.myForm.get("_codigo").disable();
    } else {
      this.myForm.get("_campo").enable();
      this.myForm.get("_codigo").enable();
    }
  }

  async actualizarKit() {
    this.loading = true;
    var respuesta = await this.inventarioService.actualizarKit(
      this.myForm.get("_idKit").value,
      this.myForm.get("_campo").value,
      this.myForm.get("_codigo").value,
      this.myForm.get("_descuento").value
    );
    if (this.myForm.get("_descuento").value % 1 === 0) {
      if (respuesta["codigo"] == "200") {
        this.loading = false;
        openSnackBar("Se actualizó correctamente", this.snackBar);
        var kits: any = this.dataSource.data;
        var kit = kits.find(kit => kit["_id"] == this.myForm.get("_idKit").value);
        var index = kits.indexOf(kit);
        kits.splice(index, 1);
        kits.push({
          _id: respuesta["respuesta"].IdKit,
          descripcion: respuesta["respuesta"].Descripcion,
          utilizado: respuesta["respuesta"].KitUtilizado,
          codigo: respuesta["respuesta"].Codigo,
          descuento: respuesta["respuesta"].AsignarDescuentoKit.Descuento.Porcentaje,
          estado: respuesta["respuesta"].Estado,
        });
        this.dataSource.data = kits;
        this.limpiarCampos();
      } else if (respuesta["codigo"] == "400") {
        openDialog("Inténtalo de nuevo", "advertencia", this.dialog);
      } else if (respuesta["codigo"] == "418") {
        openDialog(respuesta["mensaje"], "advertencia", this.dialog);
      } else if (respuesta["codigo"] == "500") {
        openDialog("Problemas con el servidor", "advertencia", this.dialog);
      }
    } else {
      openDialog("El descuento debe ser entero", "advertencia", this.dialog);
    }
  }

  eliminarKit(idKit) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "250px",
      height: "auto",
      data: {
        mensaje: "",
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        var respuesta = await this.inventarioService.eliminarKit(idKit);
        if (respuesta["codigo"] == "200") {
          openSnackBar("Se eliminó correctamente", this.snackBar);
          var kits: any = this.dataSource.data;
          var kit = kits.find((kit) => kit["_id"] == idKit);
          var index = kits.indexOf(kit);
          kits.splice(index, 1);
          this.dataSource.data = kits;
        } else if (respuesta["codigo"] == "400") {
          openDialog("Inténtalo de nuevo", "advertencia", this.dialog);
        } else if (respuesta["codigo"] == "418") {
          openDialog(respuesta["mensaje"], "advertencia", this.dialog);
        } else if (respuesta["codigo"] == "500") {
          openDialog("Problemas con el servidor", "advertencia", this.dialog);
        }
      }
    });
  }

  async consultarIntereses() {
    var respuesta = await this.inventarioService.consultarIntereses();    
    if (respuesta["codigo"] == "200") {
      var intereses: any = [];
      respuesta["respuesta"].map((interes) => {
        intereses.push({
          _id: interes.IdConfiguracionInteres,
          tasaInteres: interes.TasaInteres,
          idInteres: interes.IdTipoInteres,
          tipoInteres: "NORMAL",
          tasaInteresMora: interes.TasaInteresMora,
          idInteresMora: interes.IdTipoInteresMora,
          tipoInteresMora: "MORA",
          utilizado: interes.utilizado,
          estado: interes.Estado,
          mostrar: true,
        });
      });
      this.dataSource.data = intereses;
      this.dataSource.paginator = this.paginator;
    }
  }

  async consultarTiposInteres() {
    var respuesta = await this.inventarioService.consultarTiposInteres();
    if (respuesta["codigo"] == "200") {
      this.loading = false;
      respuesta["respuesta"].map((tipoInteres) => {
        if (tipoInteres.Descripcion == "MORA") {
          this.myForm.get("_idInteresMora").setValue(tipoInteres.IdTipoInteres);
          this.myForm.get("_interesMora").setValue(tipoInteres.Descripcion);
        } else {
          this.myForm.get("_idInteres").setValue(tipoInteres.IdTipoInteres);
          this.myForm.get("_interes").setValue(tipoInteres.Descripcion);
        }
      });
    }
  }

  async crearInteres() {
    var respuesta = await this.inventarioService.crearInteres(
      this.myForm.get("_idInteres").value,
      this.myForm.get("_tasaInteres").value,
      this.myForm.get("_idInteresMora").value,
      this.myForm.get("_tasaInteresMora").value
    );
    if (respuesta["codigo"] == "200") {
      openSnackBar("Se ingresó correctamente", this.snackBar);
      this.consultarIntereses();
      this.limpiarCampos();
    } else if (respuesta["codigo"] == "400") {
      openDialog("Inténtalo de nuevo", "advertencia", this.dialog);
    } else if (respuesta["codigo"] == "418") {
      openDialog(respuesta["mensaje"], "advertencia", this.dialog);
    } else if (respuesta["codigo"] == "500") {
      openDialog("Problemas con el servidor", "advertencia", this.dialog);
    }
  }

  eliminarDeshabilitarInteres(idInteres) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "250px",
      height: "auto",
      data: {
        mensaje: "",
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        var respuesta = await this.inventarioService.eliminarDeshabilitarInteres(
          idInteres
        );
        console.log(respuesta);
        
        if (respuesta["codigo"] == "200") {
          openSnackBar("Se deshabilitó correctamente", this.snackBar);
          this.consultarIntereses();
        }
      }
    });
  }

  async habilitarInteres(idInteres) {
    var respuesta = await this.inventarioService.habilitarInteres(idInteres);
    if (respuesta["codigo"] == "200") {
      openSnackBar("Se habilitó correctamente", this.snackBar);
      this.consultarIntereses();
    }
  }

  actualizarOpcion(titulo, suffix, encabezadoTabla, tabla) {
    this.titulo = titulo;
    this.suffix = suffix;
    this.encabezadoTabla = encabezadoTabla;
    this.tabla = tabla;
  }

  setValidators(flag) {
    if (flag) {
      this.myForm.get("_codigo").setValidators([Validators.required]);
      this.myForm
        .get("_descuento")
        .setValidators([
          Validators.required,
          Validators.pattern(/^-?(0|[0-9]\d*)?$/),
        ]);
      this.myForm.get("_codigo").updateValueAndValidity();
      this.myForm.get("_descuento").updateValueAndValidity();
    } else {
      this.myForm.get("_campo").clearValidators();
      this.myForm.get("_campo").updateValueAndValidity();
      this.myForm
        .get("_tasaInteres")
        .setValidators([
          Validators.required,
          Validators.pattern(/^[0-9]\d{0,9}(\.\d{1,3})?%?$/),
        ]);
      this.myForm
        .get("_tasaInteresMora")
        .setValidators([
          Validators.required,
          Validators.pattern(/^[0-9]\d{0,9}(\.\d{1,3})?%?$/),
        ]);
      this.myForm.get("_tasaInteres").updateValueAndValidity();
      this.myForm.get("_tasaInteresMora").updateValueAndValidity();
    }
  }

  clearValidators(flag) {
    if (flag) {
      this.myForm.get("_codigo").clearValidators();
      this.myForm.get("_descuento").clearValidators();
      this.myForm.get("_codigo").updateValueAndValidity();
      this.myForm.get("_descuento").updateValueAndValidity();
    } else {
      this.myForm.get("_campo").setValidators([Validators.required]);
      this.myForm.get("_campo").updateValueAndValidity();
      this.myForm.get("_tasaInteres").clearValidators();
      this.myForm.get("_tasaInteresMora").clearValidators();
      this.myForm.get("_tasaInteres").updateValueAndValidity();
      this.myForm.get("_tasaInteresMora").updateValueAndValidity();
    }
  }

  selecionarOpcion(opcion) {
    this.loading = true;
    this.dataSource.data = [];
    if (opcion._id === "1") {
      this.actualizarOpcion("Tipo Producto", "o", "Tipo Productos", [
        "descripcion",
        "acciones",
      ]);
      this.consultarTipoProductos();
    } else if (opcion._id === "2") {
      this.actualizarOpcion("Presentación", "a", "Presentaciones", [
        "descripcion",
        "acciones",
      ]);
      this.consultarPresentaciones();
    } else if (opcion._id === "3") {
      this.actualizarOpcion("Medida", "a", "Medidas", [
        "descripcion",
        "acciones",
      ]);
      this.consultarMedidas();
    } else if (opcion._id === "4") {
      this.actualizarOpcion("Kit", "o", "Kits", [
        "descripcion",
        "codigo",
        "descuento",
        "acciones",
      ]);
      this.consultarDescuentos();
      this.consultarKits();
    } else if (opcion._id === "5") {
      this.actualizarOpcion("Interés", "o", "Intereses", [
        "tasaInteres",
        "tipoInteres",
        "tasaInteresMora",
        "tipoInteresMora",
        "acciones",
      ]);
      this.consultarIntereses();
      this.consultarTiposInteres();
    }
    if (opcion._id === "4") {
      this.soloParaKits = true;
      this.setValidators(true);
    } else {
      this.soloParaKits = false;
      this.clearValidators(true);
    }
    if (opcion._id === "5") {
      this.ocultarCampoCuandoIntereses = true;
      this.mostrarSeccionCuandoIntereses = false;
      this.setValidators(false);
    } else {
      this.ocultarCampoCuandoIntereses = false;
      this.mostrarSeccionCuandoIntereses = true;
      this.clearValidators(false);
    }
    this.filter = "";
    this.mostrarForm = false;
    this.myForm.reset();
    this.myForm.get("_idCampo").setValue(opcion._id);
  }

  validarFormulario() {
    if (this.myForm.valid) {
      if (this.myForm.get("_idCampo").value === "1") {
        this.crearTipoProducto();
      } else if (this.myForm.get("_idCampo").value === "2") {
        this.crearPresentacion();
      } else if (this.myForm.get("_idCampo").value === "3") {
        this.crearMedida();
      } else if (this.myForm.get("_idCampo").value === "4") {
        if (this.botonIngresar == "ingresar") {
          this.crearKit();
        } else if (this.botonIngresar == "modificar") {
          this.actualizarKit();
        }
      } else if (this.myForm.get("_idCampo").value === "5") {
        this.crearInteres();
      }
    }
  }

  eliminarCampo(_id) {
    if (this.myForm.get("_idCampo").value === "1") {
      this.eliminarTipoProducto(_id);
    } else if (this.myForm.get("_idCampo").value === "2") {
      this.eliminarPresentacion(_id);
    } else if (this.myForm.get("_idCampo").value === "3") {
      this.eliminarMedida(_id);
    } else if (this.myForm.get("_idCampo").value === "4") {
      this.eliminarKit(_id);
    } else if (this.myForm.get("_idCampo").value === "5") {
      this.eliminarDeshabilitarInteres(_id);
    }
  }

  limpiarCampos() {
    this.myForm.get("_codigo").reset();
    this.myForm.get("_descuento").reset();
    this.myForm.get("_campo").reset();
    this.myForm.get("_tasaInteres").reset();
    this.myForm.get("_tasaInteresMora").reset();
  }

  search(term: string) {
    term = term.trim();
    term = term.toUpperCase();
    this.dataSource.filter = term;
  }

  ngOnInit() {
    this.myForm.get("_idCampo").setValue(this.opciones[0]._id);
    this.myForm.get("_interes").disable();
    this.myForm.get("_interesMora").disable();
    this.loading = true;
    this.mostrarForm = false;
    this.actualizarOpcion("Tipo Producto", "o", "Tipo Productos", [
      "descripcion",
      "acciones",
    ]);
    this.consultarTipoProductos();
  }

  tabla = ["descripcion", "acciones"];
}
