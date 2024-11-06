import { Component } from '@angular/core';
import { ProductoService } from '../servicio/producto/producto.service';
import { Producto } from '../interfaces/Producto';
import { ViewWillEnter, ViewDidLeave } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements ViewWillEnter, ViewDidLeave {
  public productos: Producto[] = [];
  private subProducto!: Subscription;

  constructor(private navCtrl: NavController,private prdS: ProductoService) {}

  ionViewWillEnter(): void {
    // Suscribirse a los productos del servicio
    this.subProducto = this.prdS.producto.subscribe((productos) => {
      this.productos = productos;
    });
    // Listar productos inicialmente
    this.prdS.listarProductos();
  }

  ionViewDidLeave(): void {
    // Desuscribirse cuando se sale de la vista
    if (this.subProducto) {
      this.subProducto.unsubscribe();
    }
  }

  // Método para cargar más productos cuando el usuario hace scroll
  public loadMore(event: any) {
    this.prdS.siguientesProductos().then(() => {
      event.target.complete();
      // Desactiva el scroll infinito cuando ya se han cargado todos los productos
      if (this.productos.length >= this.prdS.total) {
        event.target.disabled = true;
      }
    });
  }

  salir() {
    this.navCtrl.navigateBack('/'); // Navega a la página principal o de inicio de sesión
  }
}
