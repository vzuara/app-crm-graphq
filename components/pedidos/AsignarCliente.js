import Select from 'react-select';
import { useContext, useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import PedidoContext from '../../context/pedidos/PedidoContext';

const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
      id
      nombre
      apellido
      empresa
      email
      telefono
      vendedor
      creado
    }
  }
`;

export const AsignarCliente = () => {
  const [cliente, setCliente] = useState({});
  const pedidoContext = useContext(PedidoContext);

  const { agregarCliente } = pedidoContext;

  const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);

  useEffect(() => {
    agregarCliente(cliente);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cliente]);

  const seleccionarCliente = (cliente) => {
    setCliente(cliente);
  };

  if (loading) return null;

  const { obtenerClientesVendedor } = data;

  return (
    <>
      <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>
        1.- Asigna un cliente al pedido
      </p>
      <Select
        className='mt-3'
        options={obtenerClientesVendedor}
        onChange={(opcion) => seleccionarCliente(opcion)}
        placeholder='Busque o seleccone un cliente'
        noOptionsMessage={() => 'No hay resultados'}
        getOptionValue={(opciones) => opciones.id}
        getOptionLabel={(opciones) => opciones.nombre}
      />
    </>
  );
};
