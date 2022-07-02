import { useContext, useEffect, useState } from 'react';
import PedidoContext from '../../context/pedidos/PedidoContext';

const ProductoResumen = ({ producto }) => {
  const pedidoContext = useContext(PedidoContext);
  const { cantidadProductos, actualizarTotal } = pedidoContext;

  const [cantidad, setCantidad] = useState(0);

  useEffect(() => {
    actualizarCantidad();
    actualizarTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cantidad]);

  const actualizarCantidad = () => {
    const nuevoProducto = { ...producto, cantidad: Number(cantidad) };
    cantidadProductos(nuevoProducto);
  };

  const { nombre, precio } = producto;

  return (
    <div className='md:flex md:justify-between md:item-center mt-5'>
      <div className='md:w-2/4 mb-2 md:bm-0'>
        <p className='text-sm'>{nombre}</p>
        <p>$ {precio}</p>
      </div>
      <input
        type='number'
        placeholder='Cantidad'
        className='shadow apperance-none border rounded w-full px-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 md:ml-4'
        onChange={(e) => setCantidad(e.target.value)}
        value={cantidad}
      />
    </div>
  );
};

export default ProductoResumen;
