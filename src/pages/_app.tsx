import type { AppProps } from "next/app"
import {Elements} from '@stripe/react-stripe-js';

import Head from "next/head"
import { SSRProvider } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import "../../styles/globals.css"
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SSRProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {/* Elements have to wrap the components that will use Stripe */}
      <Elements stripe={stripePromise}>
        <Component {...pageProps} />
      </Elements>
    </SSRProvider>
  )
}

export default MyApp

