import { useFormik } from 'formik';
import Layout from '../components/Layout';
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import { useRouter } from 'next/router';

const NUEVA_CUENTA = gql`
  mutation nuevoUsuario($input: UsuarioInput) {
    nuevoUsuario(input: $input) {
      id
      nombre
      apellido
      email
    }
  }
`;

const NuevaCuenta = () => {
  const [mensaje, setMensaje] = useState(null);
  const [nuevoUsuario] = useMutation(NUEVA_CUENTA);

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      nombre: Yup.string().trim().required('El nombre es obligatorio'),
      apellido: Yup.string().trim().required('El apellido es obligatorio'),
      email: Yup.string()
        .email('El email no es valido')
        .trim()
        .required('El email es obligatorio'),
      password: Yup.string()
        .trim()
        .required('El password es obligatorio')
        .min(6, 'El password debe ser al menos de 6 caracteres'),
    }),
    onSubmit: async (valores) => {
      const { nombre, apellido, email, password } = valores;

      try {
        const { data } = await nuevoUsuario({
          variables: {
            input: {
              nombre,
              apellido,
              email,
              password,
            },
          },
        });

        setMensaje(
          `Se creo correctamente el Usuario ${data.nuevoUsuario.nombre}`
        );

        setTimeout(() => {
          setMensaje(null);
          router.push('/login');
        }, 3000);
      } catch (error) {
        setMensaje(error.message.replace('Graphql error:', ''));
        setTimeout(() => {
          setMensaje(null);
        }, 3000);
      }
    },
  });

  // if (loading) return 'Cargando...';

  const mostrarMensaje = () => {
    return (
      <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
        <p>{mensaje}</p>
      </div>
    );
  };

  return (
    <Layout>
      {mensaje && mostrarMensaje()}
      <h1 className='text-center text-2xl text-white font-light'>
        Crear Nueva Cuenta
      </h1>
      <div className='flex justify-center mt-5'>
        <div className='w-full max-w-sm'>
          <form
            className='bg-white rounded shadow-md px-8 pt-6 pb-4'
            onSubmit={formik.handleSubmit}
          >
            <div className='mb-4'>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='nombre'
              >
                Nombre
              </label>
              <input
                className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                id='nombre'
                type='text'
                placeholder='Nombre Usuario'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nombre}
              />
            </div>
            {formik.touched.nombre && formik.errors.nombre ? (
              <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                <p className='font-bold'>Error</p>
                <p>{formik.errors.nombre}</p>
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
                placeholder='Apellido Usuario'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.apellido}
              />
            </div>
            {formik.touched.apellido && formik.errors.apellido ? (
              <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                <p className='font-bold'>Error</p>
                <p>{formik.errors.apellido}</p>
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
            </div>
            {formik.touched.email && formik.errors.email ? (
              <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                <p className='font-bold'>Error</p>
                <p>{formik.errors.email}</p>
              </div>
            ) : null}

            <div className='mb-4'>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='password'
              >
                Password
              </label>
              <input
                className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                id='password'
                type='password'
                placeholder='Password Usuario'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                <p className='font-bold'>Error</p>
                <p>{formik.errors.password}</p>
              </div>
            ) : null}
            <input
              type='submit'
              className='bg-gray-800 rounded w-full mt-5 p-2 text-white uppercase hover:bg-gray-900'
              value='Crear Cuenta'
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NuevaCuenta;
