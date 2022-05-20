import '../styles/globals.css'
import { ToastContainer } from 'react-toastify';
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} >
        <style jsx>
          {`
        * {
          font-family:  Source Sans Pro, sans-serif;
        }
      `}
        </style>
      </Component>
      <ToastContainer limit={1} />
    </Layout>
  )
}

export default MyApp
