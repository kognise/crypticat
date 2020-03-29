import '../reset.css'

import Head from 'next/head'
import { AppProps } from 'next/app'

export default ({ Component, pageProps }: AppProps) => {
  return (
    <div className='dark container'>
      <Head>
        <link href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' rel='stylesheet' />
      </Head>
      <Component {...pageProps} />
      <style jsx>{`
        .dark {
          --heading-primary: #FFFFFF;
          --heading-secondary: #B9BBBE;

          --text-normal: #DDDDDD;
          --text-muted: #72767D;

          --background-main: #16171A;
          --background-chat: #202225;
          --background-input: #272A2E;
          --background-header: #16171A;

          --interactive-normal: #B9BBBE;
          --accent: #3F51B5;
        }

        .container {
          font-family: 'Inter', sans-serif;
          height: 100vh;

          --radius-lg: 8px;
          --radius-sm: 4px;

          --font-scale: 1;
          --font-lg: calc(2rem * var(--font-scale));
          --font-md: calc(1rem * var(--font-scale));
          --font-sm: calc(0.875rem * var(--font-scale));

          --field-height: calc(2.25rem * var(--font-scale));
        }
      `}</style>
    </div>
  )
}