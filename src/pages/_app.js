import Head from 'next/head';
import '../styles/globals.css';
import { Provider } from 'react-redux';
import store, { persistor } from '../redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import 'react-toastify/dist/ReactToastify.css';
import  {ToastContainer}  from 'react-toastify';
import favicon from '../assets/favicon.png';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"><div className="animate-spin h-10 w-10 border-2 border-white/30 border-t-white rounded-full" /></div>} persistor={persistor}>
        <Head>
          <link rel="icon" type="image/png" sizes="32x32" href={favicon.src || favicon} />
          <link rel="icon" type="image/png" sizes="16x16" href={favicon.src || favicon} />
          <link rel="shortcut icon" href={favicon.src || favicon} />
          <link rel="apple-touch-icon" sizes="180x180" href={favicon.src || favicon} />
        </Head>
        <Component {...pageProps} />
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
