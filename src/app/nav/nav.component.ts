import { Component, ViewChild, OnInit } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, filter, withLatestFrom } from "rxjs/operators";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { MatSidenav } from "@angular/material";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"],
})
export class NavComponent implements OnInit {
  @ViewChild("drawer", { static: true }) drawer: MatSidenav;
  @ViewChild("sidenav", { static: false }) sidenav: MatSidenav;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    router.events
      .pipe(
        withLatestFrom(this.isHandset$),
        filter(([a, b]) => b && a instanceof NavigationEnd)
      )
      .subscribe((_) => {
        this.drawer.close();
        this.route = this.router.url
          .split("/")[1]
          .replace("-", " ")
          .toUpperCase();
      });
  }

  salir() {
    localStorage.clear();
  }

  goBack() {
    if (this.router.url == "/compras" || this.router.url == "/ventas") {
      this.router.navigateByUrl("/compra-venta");
    }
  }

  route: any = "";
  nav_items = [];
  rutasPorTipoUsuario: any[] = [];
  compraVenta = false;

  ngOnInit() {
    if (localStorage.getItem("miCuenta.tipoUsuario") == "1") {
      this.rutasPorTipoUsuario = ["/usuarios", "/personas", "/cuenta"];
      this.nav_items.push(
        {
          name: "Usuarios",
          icon: "person",
          url: "/usuarios",
        },
        {
          name: "Personas",
          icon: "supervisor_account",
          url: "/personas",
        },
        {
          name: "Cuenta",
          icon: "face",
          url: "/cuenta",
        }
      );
    } else if (localStorage.getItem("miCuenta.tipoUsuario") == "2") {
      this.rutasPorTipoUsuario = ["/visitas", "/cuenta"];
      this.nav_items.push(
        {
          name: "Visitas",
          icon: "chrome_reader_mode",
          url: "/visitas",
        },
        {
          name: "Cuenta",
          icon: "face",
          url: "/cuenta",
        }
      );
    } else if (localStorage.getItem("miCuenta.tipoUsuario") == "3") {
      this.rutasPorTipoUsuario = [
        "/personas",
        "/configuracion-productos",
        "/inventarios",
        "/stock",
        "/asignar-tecnico-cliente",
        "/abonos",
        "/localizaciones",
        "/provincias",
        "/cantones",
        "/parroquias",
        "/comunidades",
        "/compra-venta",
        "/compras",
        "/ventas",
        "/cuenta",
      ];
      this.nav_items.push(
        {
          name: "Personas",
          icon: "supervisor_account",
          url: "/personas",
        },
        {
          name: "Conf. Productos",
          icon: "settings",
          url: "/configuracion-productos",
        },
        {
          name: "Inventario",
          icon: "storage",
          url: "/inventarios",
        },
        {
          name: "Stock",
          icon: "list_alt",
          url: "/stock",
        },
        {
          name: "Asignar Técnico Clientes",
          icon: "assignment_ind",
          url: "/asignar-tecnico-cliente",
        },
        {
          name: "Abonos",
          icon: "attach_money",
          url: "/abonos",
        },
        {
          name: "Localidades",
          icon: "where_to_vote",
          url: "/localizaciones",
        },
        {
          name: "Compra Venta",
          icon: "shop",
          url: "/compra-venta",
        },
        {
          name: "Cuenta",
          icon: "face",
          url: "/cuenta",
        }
      );
    }
    if (!this.rutasPorTipoUsuario.includes(this.router.url)) {
      this.router.navigateByUrl(this.rutasPorTipoUsuario[0]);
    }
    if (this.router.url == "/") {
      this.router.navigateByUrl(this.rutasPorTipoUsuario[0]);
    }
    if (this.router.url == "/compras" || this.router.url == "/ventas") {
      this.compraVenta = true;
    } else {
      this.compraVenta = false;
    }
    this.route = this.router.url.split("/")[1].replace("-", " ").toUpperCase();
    this.router.events.subscribe((_) => {
      if (this.router.url == "/compras" || this.router.url == "/ventas") {
        this.compraVenta = true;
      } else {
        this.compraVenta = false;
      }
      this.route = this.router.url
        .split("/")[1]
        .replace("-", " ")
        .toUpperCase();
    });
  }
}
