import { chain, defaultChains } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { WalletLinkConnector } from 'wagmi/connectors/walletLink';

// Chains for connectors to support
const chains = defaultChains;

// Set up connectors
const connectors = () => {
	return [
		new InjectedConnector({
			chains,
			options: { shimDisconnect: true }
		}),
		new WalletConnectConnector({
			options: {
				// infuraId,
				qrcode: true
			}
		})
	];
};

export { connectors };
