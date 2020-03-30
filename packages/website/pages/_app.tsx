import '../reset.css'

import Head from 'next/head'
import { AppProps } from 'next/app'

export default ({ Component, pageProps }: AppProps) => {
  return (
    <div className='dark-theme container'>
      <Head>
        <link href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap' rel='stylesheet' />
      </Head>
      <Component {...pageProps} />

      <style jsx>{`
        .container {
          height: 100vh;
        }
      `}</style>

      <style jsx global>{`
        .dark-theme {
          --heading-primary: #FFFFFF;
          --heading-secondary: #B9BBBE;

          --text-normal: #DDDDDD;
          --text-muted: #72767D;

          --background-main: #16171A;
          --background-chat: #202225;
          --background-input: #272A2E;
          --background-header: #16171A;

          --interactive-normal: #B9BBBE;
          --interactive-hover: #FFFFFF;

          --ghost: rgba(255, 255, 255, 2%);
          --accent: #3F51B5;
        }

        body {
          font-family: 'Inter', sans-serif;

          --radius-lg: 8px;
          --radius-sm: 4px;

          --font-scale: 1;
          --font-lg: calc(2rem * var(--font-scale));
          --font-md: calc(1rem * var(--font-scale));
          --font-sm: calc(0.875rem * var(--font-scale));

          --field-height: calc(2.25rem * var(--font-scale));
        }

        .ReactModal__Content {
          background-color: var(--background-main);
          border-radius: var(--radius-lg);
          padding: 16px;
          max-width: 440px;
          width: 100%;
          box-sizing: border-box;
        }

        .ReactModal__Overlay {
          position: fixed;
          top: 0px;
          left: 0px;
          right: 0px;
          bottom: 0px;
          background-color: rgba(0, 0, 0, 0.85);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 200ms ease-in;
        }

        .ReactModal__Overlay--after-open{
          opacity: 1;
        }

        .ReactModal__Overlay--before-close{
          opacity: 0;
        }
      `}</style>
    </div>
  )
}