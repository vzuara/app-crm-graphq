import { gql, useMutation, useQuery } from '@apollo/client';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Swal from 'sweetalert2';

const ACTUALIZAR_PRODUCTO = gql`
  mutation actualizarProducto($id: ID!, $input: ProductoInput) {
    actualizarProducto(id: $id, input: $input) {
      id
      nombre
      existencia
      precio
      creado
    }
  }
`;

const OBTENER_PRODUCTO = gql`
  query ($id: ID!) {
    obtenerProducto(id: $id) {
      id
      nombre
      existencia
      precio
      creado
    }
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

const EditarProducto = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;

  const { data, loading, error } = useQuery(OBTENER_PRODUCTO, {
    variables: {
      id,
    },
  });

  const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO, {
    update(cache, { data: { actualizarProducto } }) {
      // Actulizar productos
      const { obtenerProductos } = cache.readQuery({
        query: OBTENER_PRODUCTOS,
      });

      const productosActualizados = obtenerProductos.map((producto) =>
        producto.id === id ? actualizarProducto : producto
      );

      cache.writeQuery({
        query: OBTENER_PRODUCTOS,
        data: {
          obtenerProductos: productosActualizados,
        },
      });

      // Actulizar Producto Actual
      cache.writeQuery({
        query: OBTENER_PRODUCTO,
        variables: { id },
        data: {
          obtenerProducto: actualizarProducto,
        },
      });
    },
  });

  const schemaValidacion = Yup.object({
    nombre: Yup.string().trim().required('El nombre es obligatorio'),
    existencia: Yup.number()
      .positive('No se aceptan numeros negativos')
      .integer('La existencia deben ser numeros enteros')
      .required('La existencia es obligatoria'),
    precio: Yup.number()
      .positive('No se aceptan numeros negativos')
      .required('El precio es obligatorio'),
  });

  if (loading) return 'Cargando...';
  if (!data.obtenerProducto) return 'Accion no permitida';

  const { obtenerProducto } = data;

  const actualizarInfoProducto = async (valores) => {
    const { nombre, existencia, precio } = valores;

    try {
      const { data } = await actualizarProducto({
        variables: {
          id,
          input: {
            nombre,
            existencia,
            precio,
          },
        },
      });

      Swal.fire(
        'Correcto!',
        'El producto fue editado correctamente',
        'success'
      );
      router.push('/productos');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <h1 className='text-2xl text-gray-800 font-light'>Editar Producto</h1>
      <div className='flex justify-center mt-5'>
        <div className='w-full max-w-lg'>
          <Formik
            validationSchema={schemaValidacion}
            enableReinitialize
            initialValues={obtenerProducto}
            onSubmit={(valores) => {
              actualizarInfoProducto(valores);
            }}
          >
            {(props) => {
              return (
                <form
                  className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                  onSubmit={props.handleSubmit}
                >
                  <div className='mb-4'>
                    <label
                      className='block text-gray-700 text-sm font-bold mb-2'
                      htmlFor='Nombre'
                    >
                      Nombre
                    </label>
                    <input
                      className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                      id='nombre'
                      type='text'
                      placeholder='Nombre Cliente'
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.nombre}
                    />
                  </div>
                  {props.touched.nombre && props.errors.nombre ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                      <p className='font-bold'>Error</p>
                      <p>{props.errors.nombre}</p>
                    </div>
                  ) : null}

                  <div className='mb-4'>
                    <label
                      className='block text-gray-700 text-sm font-bold mb-2'
                      htmlFor='existencia'
                    >
                      Existencia
                    </label>
                    <input
                      className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                      id='Existencia'
                      type='number'
                      placeholder='Existencia'
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.existencia}
                    />
                  </div>
                  {props.touched.existencia && props.errors.existencia ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                      <p className='font-bold'>Error</p>
                      <p>{props.errors.existencia}</p>
                    </div>
                  ) : null}

                  <div className='mb-4'>
                    <label
                      className='block text-gray-700 text-sm font-bold mb-2'
                      htmlFor='precio'
                    >
                      Precio
                    </label>
                    <input
                      className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                      id='precio'
                      type='number'
                      placeholder='Precio'
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.precio}
                    />
                  </div>
                  {props.touched.precio && props.errors.precio ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                      <p className='font-bold'>Error</p>
                      <p>{props.errors.precio}</p>
                    </div>
                  ) : null}

                  <input
                    type='submit'
                    className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 rounded'
                    value='Editar producto'
                  />
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default EditarProducto;
