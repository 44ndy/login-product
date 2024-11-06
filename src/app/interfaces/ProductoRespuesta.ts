import { Producto } from "./Producto";

export interface ProductoRespuesta {
  products: Producto[];
  total: number;
  skip: number;
  limit: number;
}
