import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import Layout from '../components/Layout';
import { Pedido } from '../components/Pedido';

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

const Pedidos = () => {
  const { data, loading, error } = useQuery(OBTENER_PEDIDOS);

  if (loading) return 'Cargando...';

  const { obtenerPedidosVendedor } = data;

  return (
    <Layout>
      <h1 className='text-2xl text-gray-800 font-light'>Pedidos</h1>

      <Link href='/nuevopedido'>
        <a className='bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase w-full lg:w-auto text-center'>
          Nuevo Pedido
        </a>
      </Link>

      {obtenerPedidosVendedor.length === 0 ? (
        <p className='mt-5 text-center text-2xl'>No hay pedidos aun</p>
      ) : (
        obtenerPedidosVendedor.map((pedido) => (
          <Pedido key={pedido.id} pedido={pedido} />
        ))
      )}
    </Layout>
  );
};

export default Pedidos;
