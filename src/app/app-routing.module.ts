import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Components
import { LoginComponent } from "./components/login/login.component";

// Components
import { NavComponent } from "./nav/nav.component";
import { UsuarioComponent } from "./components/usuario/usuario.component";
import { PersonaComponent } from "./components/persona/persona.component";
import { InventarioComponent } from "./components/inventario/inventario.component";
import { CompraComponent } from "./components/compra/compra.component";
import { VentaComponent } from "./components/venta/venta.component";
import { Page404Component } from "./components/page404/page404.component";
import { PanelAdministracionComponent } from "./components/panel-administracion/panel-administracion.component";
import { ConfiguracionProductoComponent } from "./components/configuracion-producto/configuracion-producto.component";
import { CuentaComponent } from "./components/cuenta/cuenta.component";
import { StockComponent } from "./components/stock/stock.component";
import { CompraRubrosComponent } from "./components/compra-rubros/compra-rubros.component";
import { CreditosAbonosComponent } from "./components/creditos-abonos/creditos-abonos.component";
import { AsignarTecnicoClienteComponent } from "./components/asignar-tecnico-cliente/asignar-tecnico-cliente.component";
import { VisitaComponent } from "./components/visita/visita.component";
import { RegistrarVisitaComponent } from "./components/registrar-visita/registrar-visita.component";

// Guards
import { ValidarUsuarioGuard } from "src/app/guards/validar-usuario.guard";
import { ComunidadComponent } from "./components/comunidad/comunidad.component";
import { ParroquiaComponent } from "./components/parroquia/parroquia.component";
import { CantonComponent } from "./components/canton/canton.component";
import { ProvinciaComponent } from "./components/provincia/provincia.component";
import { CompraVentaComponent } from "./components/compra-venta/compra-venta.component";
import { ComprasRubrosAnuladasComponent } from "./components/compras-rubros-anuladas/compras-rubros-anuladas.component";
import { VentaRubrosComponent } from "./components/venta-rubros/venta-rubros.component";
import { ReportesComponent } from './components/reportes/reportes.component';

var allRoutes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  {
    path: "dash",
    component: NavComponent,
    // canActivate: [ValidarUsuarioGuard],
    children: [
      {
        path: "usuarios",
        component: UsuarioComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: "personas",
        component: PersonaComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: "configuracion-productos",
        component: ConfiguracionProductoComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: "inventarios",
        component: InventarioComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: "stock",
        component: StockComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: "asignar-tecnico-cliente",
        component: AsignarTecnicoClienteComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: "abonos",
        component: CreditosAbonosComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: "compra-venta",
        component: CompraVentaComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: "compras",
        component: CompraComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: "ventas",
        component: VentaComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: "localizaciones",
        component: PanelAdministracionComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: "provincias",
        component: ProvinciaComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: "cantones",
        component: CantonComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: "parroquias",
        component: ParroquiaComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: "comunidades",
        component: ComunidadComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: "visitas",
        component: VisitaComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: "registrar-visita/:id",
        component: RegistrarVisitaComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: "compras-rubros",
        component: CompraRubrosComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: "ventas-rubros",
        component: VentaRubrosComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: "compras-rubros-anuladas",
        component: ComprasRubrosAnuladasComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: "cuenta",
        component: CuentaComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
      {
        path: "reportes",
        component: ReportesComponent,
        // canActivate: [ValidarUsuarioGuard]
      },
    ],
  },
  { path: "**", component: Page404Component },
];

const routes: Routes = allRoutes;

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
