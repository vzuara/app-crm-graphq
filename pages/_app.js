import { ApolloProvider } from '@apollo/client';
import cliente from '../config/apollo';
import PedidoState from '../context/pedidos/PedidoState';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={cliente}>
      <PedidoState>
        <Component {...pageProps} />
      </PedidoState>
    </ApolloProvider>
  );
};

export default MyApp;
