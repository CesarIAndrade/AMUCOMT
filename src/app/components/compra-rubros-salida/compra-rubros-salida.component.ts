import { Component, OnInit, Input, Output } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { RubrosService } from "src/app/services/rubros.service";
import { MatDialog } from "@angular/material";
import { ModalTicketFinalizadoComponent } from "../modal-ticket-finalizado/modal-ticket-finalizado.component";
import { openDialog } from "src/app/functions/global";
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: "app-compra-rubros-salida",
  templateUrl: "./compra-rubros-salida.component.html",
  styleUrls: ["./compra-rubros-salida.component.css"],
})
export class CompraRubrosSalidaComponent implements OnInit {
  myForm: FormGroup;
  constructor(private rubrosService: RubrosService, private dialog: MatDialog) {
    this.myForm = new FormGroup({
      _idTicket: new FormControl(""),
      _pesoTara: new FormControl(""),
      _porcentajeHumedad: new FormControl(""),
      _precioPorQuintal: new FormControl(""),
      _porcentajeImpureza: new FormControl(""),
    });
  }

  async finalizarTicket() {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "250px",
      height: "auto",
      data: {
        mensaje: "",
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        var respuesta = await this.rubrosService.finalizarTicket(
          this.myForm.get("_idTicket").value,
          "IdTicket",
          this.myForm.get("_pesoTara").value,
          "PesoTara",
          this.myForm.get("_porcentajeHumedad").value,
          this.myForm.get("_precioPorQuintal").value,
          this.myForm.get("_porcentajeImpureza").value,
          "FinalizarTicket"
        );
        if (respuesta["codigo"] == "200") {
          this.detallesTicketFinalizado(respuesta["respuesta"]);
          this.rubrosService.refresh$.emit();
          this.myForm.reset();
        } else if (respuesta["codigo"] == "418") {
          openDialog(respuesta["mensaje"], "advertencia", this.dialog);
        }
      }
    });
  }

  detallesTicketFinalizado(ticket) {
    this.dialog.open(ModalTicketFinalizadoComponent, {
      width: "auto",
      height: "auto",
      data: {
        ticket,
        ruta: "compra",
      },
    });
  }

  volver() {
    this.rubrosService.refresh$.emit();
    this.myForm.reset();
  }

  ngOnInit() {
    this.rubrosService.refresh$.subscribe(() => {
      this.myForm.get("_idTicket").setValue(this.rubrosService.idTicket);
    });
  }
}
