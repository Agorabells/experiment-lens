import { useCallback } from 'react';
import { useConnect, useAccount, useNetwork } from 'wagmi';
import { SiweMessage } from 'siwe';
import { shortAddress } from '../lib/helpers';
import { generateChallenge } from '../lib/generate-challenge';

export default function Login() {
	const [{ data: connectData }, connect] = useConnect();
	const [{ data: accountData }, disconnect] = useAccount({ fetchEns: true });
	const [{ data: networkData }] = useNetwork();

	const signIn = useCallback(
		async (connector) => {
			try {
				const res = await connect(connector); // connect from useConnect
				if (!res.data) throw res.error ?? new Error('Something went wrong');

				const challengeRes = await generateChallenge(res.data.account);
				console.log(challengeRes, '@@@@@@@@@@@@@@@@Res');

				const nonceRes = await fetch('/api/nonce');
				const message = new SiweMessage({
					domain: window.location.host,
					address: res.data.account,
					statement: 'Sign in with Ethereum to the app.',
					uri: window.location.origin,
					version: '1',
					chainId: res.data.chain?.id,
					nonce: await nonceRes.text()
				});

				const signer = await connector.getSigner();
				const signature = await signer.signMessage(message.prepareMessage());

				const verifyRes = await fetch('/api/verify', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ message, signature })
				});
				if (!verifyRes.ok) throw new Error('Error verifying message');

				// It worked! User is signed in with Ethereum
			} catch (error) {
				// add toast or set loading false
			}
		},
		[accountData, networkData]
	);

	return (
		<div>
			{accountData ? (
				<div>
					<span className="text-base text-gray-200">
						{shortAddress(accountData.address)}
					</span>
					<button onClick={disconnect}>disconnect</button>
				</div>
			) : (
				connectData?.connectors.map((connector) => (
					<button key={connector.id} onClick={() => signIn(connector)}>
						{connector.name}
						{!connector.ready && ' (unsupported)'}
					</button>
				))
			)}
		</div>
	);
}
