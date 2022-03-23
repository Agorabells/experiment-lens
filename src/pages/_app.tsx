import { Provider } from 'wagmi';
import { connectors } from '../lib/connectors';

import '../styles/globals.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Provider autoConnect connectors={connectors}>
			<Component {...pageProps} />
		</Provider>
	);
}

export default MyApp;
