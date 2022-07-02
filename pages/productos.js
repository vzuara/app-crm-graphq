import { gql, useMutation, useQuery } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import Layout from '../components/Layout';
import { Producto } from '../components/Producto';

const ELIMINAR_PRODUCTO = gql`
  mutation eliminarProducto($id: ID!) {
    eliminarProducto(id: $id)
  }
`;

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

const Productos = () => {
  const router = useRouter();

  const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
    update(cache) {
      const { obtenerProductos } = cache.readQuery({
        query: OBTENER_PRODUCTOS,
      });

      cache.evict({ broadcast: false });

      cache.writeQuery({
        query: OBTENER_PRODUCTOS,
        data: {
          obtenerProductos: obtenerProductos.filter(
            (productoActual) => productoActual.id !== id
          ),
        },
      });
    },
  });
  const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

  if (loading) return 'Cargando...';

  const confirmarEliminarProducto = () => {
    Swal.fire({
      title: 'Deseas eliminar a este producto?',
      text: 'Esta accion no se puede revertir!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await eliminarProducto({
            variables: {
              id,
            },
          });
          Swal.fire('Eliminado!', data.eliminarProducto, 'success');
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const editarProducto = () => {
    router.push({
      pathname: '/editarproducto/[id]',
      query: { id },
    });
  };

  return (
    <Layout>
      <h1 className='text-2xl text-gray-800 font-light'>Productos</h1>

      <Link href='/nuevoproducto'>
        <a className='bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase w-full lg:w-auto text-center'>
          Nuevo Producto
        </a>
      </Link>

      <div className='overflow-x-scroll'>
        <table className='table-auto mt-10 w-full w-lg'>
          <thead className='bg-gray-800'>
            <tr className='text-white'>
              <th className='w-1/5 py-2'>Nombre</th>
              <th className='w-1/5 py-2'>Existencia</th>
              <th className='w-1/5 py-2'>Precio</th>
              <th className='w-1/5 py-2'>Eliminar</th>
              <th className='w-1/5 py-2'>Editar</th>
            </tr>
          </thead>
          <tbody className='bg-white'>
            {data.obtenerProductos.map((producto) => (
              <Producto key={producto.id} producto={producto} />
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Productos;
