import { gql, useMutation, useQuery } from '@apollo/client';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Swal from 'sweetalert2';

const ACTUALIZAR_CLIENTE = gql`
  mutation actualizarCliente($id: ID!, $input: ClienteInput) {
    actualizarCliente(id: $id, input: $input) {
      id
      nombre
      apellido
      email
      empresa
      vendedor
      telefono
      creado
    }
  }
`;

const OBTENER_CLIENTE = gql`
  query ($id: ID!) {
    obtenerCliente(id: $id) {
      nombre
      apellido
      empresa
      email
      telefono
    }
  }
`;

const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
      id
      nombre
      apellido
      empresa
      email
    }
  }
`;

const EditarCliente = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;

  const { data, loading, error } = useQuery(OBTENER_CLIENTE, {
    variables: {
      id,
    },
  });

  const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE, {
    update(cache, { data: { actualizarCliente } }) {
      // Actulizar Clientes
      const { obtenerClientesVendedor } = cache.readQuery({
        query: OBTENER_CLIENTES_USUARIO,
      });

      const clientesActualizados = obtenerClientesVendedor.map((cliente) =>
        cliente.id === id ? actualizarCliente : cliente
      );

      cache.writeQuery({
        query: OBTENER_CLIENTES_USUARIO,
        data: {
          obtenerClientesVendedor: clientesActualizados,
        },
      });

      // Actulizar Cliente Actual
      cache.writeQuery({
        query: OBTENER_CLIENTE,
        variables: { id },
        data: {
          obtenerCliente: actualizarCliente,
        },
      });
    },
  });

  const schemaValidacion = Yup.object({
    nombre: Yup.string().trim().required('El nombre es obligatorio'),
    apellido: Yup.string().trim().required('El apellido es obligatorio'),
    empresa: Yup.string().trim().required('El empresa es obligatorio'),
    email: Yup.string()
      .email('El email no es valido')
      .trim()
      .required('El email es obligatorio'),
  });

  if (loading) return 'Cargando...';
  const { obtenerCliente } = data;

  const actualizarInfoCliente = async (valores) => {
    const { nombre, apellido, empresa, email, telefono } = valores;

    try {
      const { data } = await actualizarCliente({
        variables: {
          id,
          input: {
            nombre,
            apellido,
            empresa,
            email,
            telefono,
          },
        },
      });
      Swal.fire(
        'Actualizado!',
        'El cliente se actualizo correctamente',
        'success'
      );
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  // const [mensaje, setMensaje] = useState(null);

  // const mostrarMensaje = () => {
  //   return (
  //     <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
  //       <p>{mensaje}</p>
  //     </div>
  //   );
  // };

  return (
    <Layout>
      <h1 className='text-2xl text-gray-800 font-light'>Editar Cliente</h1>
      {/* {mensaje && mostrarMensaje()} */}
      <div className='flex justify-center mt-5'>
        <div className='w-full max-w-lg'>
          <Formik
            validationSchema={schemaValidacion}
            enableReinitialize
            initialValues={obtenerCliente}
            onSubmit={(valores) => {
              actualizarInfoCliente(valores);
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
                      htmlFor='apellido'
                    >
                      Apellido
                    </label>
                    <input
                      className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                      id='apellido'
                      type='text'
                      placeholder='Apellido Cliente'
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.apellido}
                    />
                  </div>
                  {props.touched.apellido && props.errors.apellido ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                      <p className='font-bold'>Error</p>
                      <p>{props.errors.apellido}</p>
                    </div>
                  ) : null}

                  <div className='mb-4'>
                    <label
                      className='block text-gray-700 text-sm font-bold mb-2'
                      htmlFor='empresa'
                    >
                      Empresa
                    </label>
                    <input
                      className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                      id='empresa'
                      type='text'
                      placeholder='Empresa Cliente'
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.empresa}
                    />
                  </div>
                  {props.touched.empresa && props.errors.empresa ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                      <p className='font-bold'>Error</p>
                      <p>{props.errors.empresa}</p>
                    </div>
                  ) : null}

                  <div className='mb-4'>
                    <label
                      className='block text-gray-700 text-sm font-bold mb-2'
                      htmlFor='email'
                    >
                      Email
                    </label>
                    <input
                      className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                      id='email'
                      type='email'
                      placeholder='Email Usuario'
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.email}
                    />
                  </div>
                  {props.touched.email && props.errors.email ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                      <p className='font-bold'>Error</p>
                      <p>{props.errors.email}</p>
                    </div>
                  ) : null}

                  <div className='mb-4'>
                    <label
                      className='block text-gray-700 text-sm font-bold mb-2'
                      htmlFor='telefono'
                    >
                      Telefono
                    </label>
                    <input
                      className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                      id='telefono'
                      type='tel'
                      placeholder='Telefono Usuario'
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.telefono}
                    />
                  </div>
                  <input
                    type='submit'
                    className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 rounded'
                    value='Editar cliente'
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

export default EditarCliente;
