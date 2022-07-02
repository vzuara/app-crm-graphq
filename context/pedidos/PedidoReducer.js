import {
  CANTIDAD_PRODUCTOS,
  SELECCIONAR_CLIENTE,
  SELECCIONAR_PRODUCTO,
  ACTUALIZAR_TOTAL,
} from '../../types';

const pedidoReducer = (state, action) => {
  switch (action.type) {
    case SELECCIONAR_CLIENTE:
      return {
        ...state,
        cliente: action.payload,
      };
    case SELECCIONAR_PRODUCTO:
      return {
        ...state,
        productos: action.payload,
      };
    case CANTIDAD_PRODUCTOS:
      return {
        ...state,
        productos: state.productos.map((producto) =>
          producto.id === action.payload.id ? action.payload : producto
        ),
      };
    case ACTUALIZAR_TOTAL:
      return {
        ...state,
        total: state.productos.reduce(
          (nuevoTotal, producto) =>
            (nuevoTotal += producto.precio * producto.cantidad),
          0
        ),
      };
    default:
      return state;
  }
};

export default pedidoReducer;
