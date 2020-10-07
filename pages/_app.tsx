import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Neversink Downloader</title>
        <meta
          name="description"
          content="A site for downloading the newest neversink filters to your PC."
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
