import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { salir, openDialog } from "../../functions/global";
import { reportsUrl } from "../../../environments/environment";

// Material
import { MatPaginator, MatTableDataSource, MatDialog } from "@angular/material";

// Services
import { InventarioService } from "src/app/services/inventario.service";
import { RubrosService } from 'src/app/services/rubros.service';

@Component({
  selector: "app-stock",
  templateUrl: "./stock.component.html",
  styleUrls: ["./stock.component.css"],
})
export class StockComponent implements OnInit {
  constructor(
    private inventarioService: InventarioService,
    private rubrosService: RubrosService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  // Para la paginacion
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  listaProductosEnStock = new MatTableDataSource<Element[]>();

  loading = true;
  secretaria: boolean;

  imprimirComprobante() {    
    window.open(reportsUrl + 'Reporte/Stock');
  }

  async consultarStock() {
    var stock = await this.inventarioService.consultarStock();
    if (stock["codigo"] == "200") {
      this.loading = false;
      var listaProductosEnStock = [];
      stock["respuesta"].map((item) => {
        var lote = "N/A";
        var kit = "N/A";
        var fechaExpiracion = "";
        var nombreProducto = "";
        var presentacion = "";
        var contenidoNeto = "";
        var medida = "";
        var codigo = "";
        var tipoProducto = "";
        var iva = "";
        var descripcion = "N/A";
        var estado = "";
        if (item.Cantidad <= 6) {
          estado = "badge badge-danger";
        } else {
          estado = "badge badge-success";
        }
        if (item.AsignarProductoLote.Lote) {
          lote = item.AsignarProductoLote.Lote.Codigo;
          fechaExpiracion = item.AsignarProductoLote.Lote.FechaExpiracion;
        } else {
          fechaExpiracion = item.AsignarProductoLote.FechaExpiracion;
        }
        if (item.AsignarProductoLote.PerteneceKit != "False") {
          kit = item.AsignarProductoLote.AsignarProductoKit.Kit.Descripcion;
          nombreProducto =
            item.AsignarProductoLote.AsignarProductoKit.ListaProductos.Producto
              .Nombre;
          contenidoNeto =
            item.AsignarProductoLote.AsignarProductoKit.ListaProductos
              .CantidadMedida;
          medida =
            item.AsignarProductoLote.AsignarProductoKit.ListaProductos.Medida
              .Descripcion;
          codigo =
            item.AsignarProductoLote.AsignarProductoKit.ListaProductos.Codigo;
          presentacion =
            item.AsignarProductoLote.AsignarProductoKit.ListaProductos
              .Presentacion.Descripcion;
          tipoProducto =
            item.AsignarProductoLote.AsignarProductoKit.ListaProductos.Producto
              .TipoProducto.Descripcion;
          iva = item.AsignarProductoLote.AsignarProductoKit.ListaProductos.Iva;
          descripcion =
            item.AsignarProductoLote.AsignarProductoKit.ListaProductos.Producto
              .Descripcion;
        } else if (item.AsignarProductoLote.PerteneceKit == "False") {
          nombreProducto =
            item.AsignarProductoLote.ConfigurarProductos.Producto.Nombre;
          contenidoNeto =
            item.AsignarProductoLote.ConfigurarProductos.CantidadMedida;
          medida =
            item.AsignarProductoLote.ConfigurarProductos.Medida.Descripcion;
          codigo = item.AsignarProductoLote.ConfigurarProductos.Codigo;
          presentacion =
            item.AsignarProductoLote.ConfigurarProductos.Presentacion
              .Descripcion;
          tipoProducto =
            item.AsignarProductoLote.ConfigurarProductos.Producto.TipoProducto
              .Descripcion;
          iva = item.AsignarProductoLote.ConfigurarProductos.Iva;
          descripcion =
            item.AsignarProductoLote.ConfigurarProductos.Producto.Descripcion;
        }
        var producto = {
          Codigo: codigo,
          Producto: nombreProducto,
          TipoProducto: tipoProducto,
          Presentacion: presentacion,
          Contenido: contenidoNeto,
          Medida: medida,
          Descripcion: descripcion,
          Iva: iva,
          Kit: kit,
          Lote: lote,
          FechaExpiracion: fechaExpiracion,
          Cantidad: item.Cantidad,
          Estado: estado,
        };
        listaProductosEnStock.push(producto);
      });
      this.listaProductosEnStock.data = listaProductosEnStock;
      this.listaProductosEnStock.paginator = this.paginator;
    } else if (stock["codigo"] == "403") {
      openDialog("Sesión Caducada", "advertencia", this.dialog);
      this.router.navigateByUrl(salir());
    }
  }

  search(term: string) {
    term = term.trim();
    term = term.toUpperCase();
    this.listaProductosEnStock.filter = term;
  }

  async consultarStockRubros(){
    var respuesta = await this.rubrosService.consultarStockRubros();
    if(respuesta["codigo"] == "200") {
      this.loading = false;
      this.listaProductosEnStock = respuesta["respuesta"];
    }
  }

  ngOnInit() {
    if(localStorage.getItem("miCuenta.descripcionTipoUsuario") === "ADMINISTRADOR") {
      this.consultarStockRubros();
      this.tablaStock = [
        "rubro",
        "fechaCreacion",
        "cantidadRubro"
      ]
      this.secretaria = false;
    } else {
      this.consultarStock();
      this.secretaria = true;
    }
  }

  tablaStock = [
    "codigo",
    "producto",
    "tipo",
    "presentacion",
    "contenido",
    "medida",
    "descripcion",
    "iva",
    "kit",
    "lote",
    "fechaExpiracion",
    "cantidad",
  ];
}
