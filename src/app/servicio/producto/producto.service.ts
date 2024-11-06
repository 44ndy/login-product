import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from './../../interfaces/Producto';
import { ProductoRespuesta } from './../../interfaces/ProductoRespuesta';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private readonly URL_PRODUCTOS = 'https://dummyjson.com/auth/products';
  private saltar = 0;
  private cantidad = 10;
  public total = 0; // Total de productos disponibles en la API
  private $productos = new BehaviorSubject<Producto[]>([]);
  public producto = this.$productos.asObservable();

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  // Método para listar los productos iniciales o en cada paginación
  public listarProductos() {
    const url_nueva = `${this.URL_PRODUCTOS}?limit=${this.cantidad}&skip=${this.saltar}`;
    this.http.get<ProductoRespuesta>(url_nueva, {
      headers: {
        'Authorization': 'Bearer ' + this.auth.accessToken,
        'Content-Type': 'application/json'
      }
    })
    .subscribe(datos => {
      const productosActualizados = [...this.$productos.value, ...datos.products];
      this.$productos.next(productosActualizados);
      this.total = datos.total;
    });
  }

  // Método para obtener los siguientes productos en la paginación
  public siguientesProductos(): Promise<void> {
    return new Promise((resolve) => {
      if (this.saltar + this.cantidad < this.total) {
        this.saltar += this.cantidad;
        this.listarProductos();
      }
      resolve();
    });
  }

  // Método para obtener los productos anteriores en caso de retroceder en la lista
  public productosAnterior(): void {
    if (this.saltar - this.cantidad >= 0) {
      this.saltar -= this.cantidad;
      this.listarProductos();
    }
  }
}
