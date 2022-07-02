import Select from 'react-select';
import { useContext, useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import PedidoContext from '../../context/pedidos/PedidoContext';

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos {
      id
      nombre
      precio
      existencia
    }
  }
`;

export const AsignarProductos = () => {
  const [productos, setProductos] = useState([]);
  const pedidoContext = useContext(PedidoContext);

  const { agregarProducto } = pedidoContext;

  const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

  useEffect(() => {
    agregarProducto(productos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productos]);

  const seleccionarProducto = (producto) => {
    setProductos(producto);
  };

  if (loading) return null;

  const { obtenerProductos } = data;

  return (
    <>
      <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>
        2.- Selecciona o busca los productos al pedido
      </p>
      <Select
        className='mt-3'
        options={obtenerProductos}
        isMulti={true}
        onChange={(opcion) => seleccionarProducto(opcion)}
        placeholder='Busque o seleccone un producto'
        noOptionsMessage={() => 'No hay resultados'}
        getOptionValue={(opciones) => opciones.id}
        getOptionLabel={(opciones) =>
          `${opciones.nombre} - ${opciones.existencia} Disponibles`
        }
      />
    </>
  );
};
