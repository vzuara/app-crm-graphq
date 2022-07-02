import Layout from '../components/Layout';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { gql, useQuery } from '@apollo/client';
import { useEffect } from 'react';

const MEJORES_VENDEDORES = gql`
  query mejoresVendedores {
    mejoresVendedores {
      vendedor {
        nombre
        email
      }
      total
    }
  }
`;

const MejoresVendedores = () => {
  const { data, loading, error, startPolling, stopPolling } =
    useQuery(MEJORES_VENDEDORES);

  useEffect(() => {
    startPolling(1000);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  if (loading) return 'Cargando';

  const { mejoresVendedores } = data;

  const vendedorGrafica = [];

  mejoresVendedores.map((vendedor, index) => {
    vendedorGrafica[index] = {
      ...vendedor.vendedor[0],
      total: vendedor.total,
    };
  });

  return (
    <Layout>
      <h1 className='text-2xl font-light'>Mejores Vendedores</h1>
      <ResponsiveContainer width='100%' height='50%'>
        <BarChart
          width={500}
          height={300}
          data={vendedorGrafica}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='nombre' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey='total' fill='#3182CE' />
        </BarChart>
      </ResponsiveContainer>
    </Layout>
  );
};

export default MejoresVendedores;
