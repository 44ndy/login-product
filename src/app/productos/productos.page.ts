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
  // Array para almacenar la lista de productos obtenidos desde el servicio.
  public productos: Producto[] = [];

  // Suscripción a los productos del servicio para manejar el flujo de datos.
  private subProducto!: Subscription;

  constructor(
    private navCtrl: NavController, // Servicio de navegación para manejar el cambio de rutas.
    private prdS: ProductoService // Servicio de productos para obtener los datos de los productos.
  ) {}

  /**
   * Hook de Ionic que se ejecuta cuando la vista está a punto de mostrarse.
   * Se usa para suscribirse a los productos y cargar la lista inicial.
   */
  ionViewWillEnter(): void {
    // Suscribirse al observable de productos en el servicio de productos.
    this.subProducto = this.prdS.producto.subscribe((productos) => {
      // Actualizar la lista local de productos cuando cambian los datos.
      this.productos = productos;
    });

    // Llamar al método para listar productos al cargar la página por primera vez.
    this.prdS.listarProductos();
  }

  /**
   * Hook de Ionic que se ejecuta cuando el usuario sale de la vista.
   * Se usa para cancelar la suscripción .
   */
  ionViewDidLeave(): void {
    // Si existe una suscripción activa, la cancelamos para liberar recursos.
    if (this.subProducto) {
      this.subProducto.unsubscribe();
    }
  }

  /**
   * Método que se llama al hacer scroll hacia abajo para cargar más productos.

   */
  public loadMore(event: any) {
    // Llama al método del servicio para obtener la siguiente página de productos.
    this.prdS.siguientesProductos().then(() => {
      // Completa el evento de scroll para que Ionic pueda detener la animación de carga.
      event.target.complete();

      // Si se han cargado todos los productos, desactiva el scroll infinito.
      if (this.productos.length >= this.prdS.total) {
        event.target.disabled = true;
      }
    });
  }

  /**
   * Método para navegar de regreso a la página principal o de inicio de sesión.
   */
  salir() {
    this.navCtrl.navigateBack('/');
  }
}
