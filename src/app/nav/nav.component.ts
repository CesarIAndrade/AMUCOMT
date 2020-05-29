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
        var temp_route: any = this.router.url.split("/");
        temp_route = temp_route[1];
        this.route = temp_route.toUpperCase();
      });
  }

  salir() {
    localStorage.clear();
  }

  route = "";
  nav_items = [];

  ngOnInit() {
    if (localStorage.getItem("miCuenta.tipoUsuario") == "1") {
      this.nav_items.push(
        {
          name: "Usuarios",
          icon: "person",
          url: "/usuarios",
        },
        {
          name: "Cuenta",
          icon: "face",
          url: "/cuenta",
        }
      );
    } else if (localStorage.getItem("miCuenta.tipoUsuario") == "2") {
      this.nav_items.push(
        {
          name: "Compra Rubros",
          icon: "shopping_cart",
          url: "/compras-rubros",
        },
        {
          name: "Venta Rubros",
          icon: "shopping_cart",
          url: "/ventas-rubros",
        },
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
      this.nav_items.push(
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
          name: "Compra Inventario",
          icon: "shop",
          url: "/compras",
        },
        {
          name: "Venta Inventario",
          icon: "shop",
          url: "/ventas",
        },
        {
          name: "Cuenta",
          icon: "face",
          url: "/cuenta",
        }
      );
    }

    if (this.router.url == "/") {
      this.router.navigateByUrl(this.nav_items[0].url);
    }

    var temp_route: any = this.router.url.split("/");
    temp_route = temp_route[1];
    this.route = temp_route.toUpperCase();
    this.router.events.subscribe((_) => {
      var temp_route: any = this.router.url.split("/");
      temp_route = temp_route[1];
      this.route = temp_route.toUpperCase();
    });
  }
}
