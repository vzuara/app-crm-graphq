import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import { AsignarCliente } from '../components/pedidos/AsignarCliente';
import { AsignarProductos } from '../components/pedidos/AsignarProductos';
import PedidoContext from '../context/pedidos/PedidoContext';
import { useContext, useState } from 'react';
import { ResumenPedido } from '../components/pedidos/ResumenPedido';
import Total from '../components/pedidos/Total';

const NUEVO_PEDIDO = gql`
  mutation nuevoPedido($input: PedidoInput) {
    nuevoPedido(input: $input) {
      id
    }
  }
`;

const OBTENER_PEDIDOS = gql`
  query {
    obtenerPedidosVendedor {
      id
      cliente {
        id
        nombre
        apellido
        email
        telefono
      }
      estado
      fecha
      pedido {
        nombre
        cantidad
      }
      total
      vendedor
    }
  }
`;

const NuevoPedido = () => {
  const [mensaje, setMensaje] = useState(null);
  const pedidoContext = useContext(PedidoContext);
  const router = useRouter();

  const { cliente, productos, total } = pedidoContext;

  const { id } = cliente;

  const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
    update(cache, { data: { nuevoPedido } }) {
      const { obtenerPedidosVendedor } = cache.readQuery({
        query: OBTENER_PEDIDOS,
      });

      cache.evict({ broadcast: false });

      cache.writeQuery({
        query: OBTENER_PEDIDOS,
        data: {
          obtenerPedidosVendedor: [...obtenerPedidosVendedor, nuevoPedido],
        },
      });
    },
  });

  const validarPedido = () => {
    return !productos.every((producto) => producto.cantidad > 0) ||
      total === 0 ||
      !cliente.id
      ? 'opacity-50 cursor-not-allowed'
      : '';
  };

  const crearNuevoPedido = async () => {
    const pedido = productos.map(
      ({ existencia, __typename, ...producto }) => producto
    );

    try {
      const { data } = await nuevoPedido({
        variables: {
          input: {
            cliente: id,
            total,
            pedido,
          },
        },
      });

      Swal.fire('Correcto', 'El pedido se registro correctamente', 'success');
      router.push('/pedidos');
    } catch (error) {
      setMensaje(error.message.replace('GraphQL error:', ''));

      setTimeout(() => {
        setMensaje(null);
      }, 3000);
    }
  };

  const mostrarMensaje = () => {
    return (
      <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
        <p>{mensaje}</p>
      </div>
    );
  };

  return (
    <Layout>
      <h1 className='text-2xl text-gray-800 font-light'>Nuevo Pedido</h1>
      {mensaje && mostrarMensaje()}
      <div className='flex justify-center mt-5'>
        <div className='w-full max-w-lg'>
          <AsignarCliente />
          <AsignarProductos />
          <ResumenPedido />
          <Total />

          <button
            type='button'
            className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 rounded ${validarPedido()}`}
            onClick={() => crearNuevoPedido()}
          >
            Registrar Pedido
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default NuevoPedido;
