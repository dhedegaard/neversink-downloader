import { CssBaseline } from "@material-ui/core";
import type { AppProps } from "next/app";
import Head from "next/head";
// eslint-disable-next-line @typescript-eslint/no-use-before-define
import React from "react";

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector<HTMLElement>("#jss-server-side");
    if (jssStyles != null && jssStyles.parentElement != null) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta name="theme-color" content="#3f51b5" />
        <meta
          name="description"
          content="A site for downloading the newest neversink filters to your PC."
        />
        <title>Neversink Downloader</title>
      </Head>
      <CssBaseline />
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
