import Head from 'next/head';
import Navibar from './Navibar';
//import Footer from './Footer';
import Script from 'next/script'
//
function Layout({ children }) {
  return (
    <div>
      <Head>
        <title key="title">NextJs App</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css"
        rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" />
      </Head>
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js"
        ></Script>
      {/*
      <Script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0/dist/Chart.min.js"
        ></Script>
      */}
      <Navibar />
      <hr className="my-0" />
      {children}
      <br />
    </div>
  )
}

export default Layout
