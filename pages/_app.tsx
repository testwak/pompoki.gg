import "../styles/globals.css";
import type { AppProps } from 'next/app';
import {HeroUIProvider} from "@heroui/system";
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <HeroUIProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </HeroUIProvider>
    )
}

export default MyApp;
