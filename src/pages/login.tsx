import { useCallback } from 'react';
import { useConnect, useAccount, useNetwork } from 'wagmi';
import { SiweMessage } from 'siwe';
import { shortAddress } from '../lib/helpers';
import { generateChallenge } from '../lib/generate-challenge';
import { authenticate } from '../lib/authenticate';
import { verify } from '../lib/verify';
import { signText, getSignerAddress } from '../lib/ethers.service';

export default function Login() {
	const [{ data: connectData }, connect] = useConnect();
	const [{ data: accountData }, disconnect] = useAccount({ fetchEns: true });
	const [{ data: networkData }] = useNetwork();

	const signIn = useCallback(
		async (connector) => {
			try {
				const res = await connect(connector); // connect from useConnect
				if (!res.data) throw res.error ?? new Error('Something went wrong');
				const address = await getSignerAddress();
				// generate challenges from life
				console.log("generate challenges from life");
				const challengeRes = await generateChallenge(address);
				console.log("challengeRes",challengeRes);

				const nonceRes = await fetch('/api/nonce');
				const message = new SiweMessage({
					domain: window.location.host,
					address: res.data.account,
					statement: challengeRes.data.challenge.text,
					uri: window.location.origin,
					version: '1',
					chainId: res.data.chain?.id,
					nonce: await nonceRes.text()
				});

				// const signer = await connector.getSigner();
				// const signature = await signer.signMessage(message.prepareMessage());
				const signature = await signText(message.prepareMessage());
				console.log("signature",signature,address);
				// error pa gyud
				const accessTokens = await authenticate(address, signature);

				console.log("success accessTokens",accessTokens, signature, '@@@@@@@@@@@@@@@@@@@@');
				// verify access token to lens protocol
				 const verifyRes = await verify(accessTokens.data.authenticate.accessToken);

				// const verifyRes = await fetch('/api/verify', {
				// 	method: 'POST',
				// 	headers: {
				// 		'Content-Type': 'application/json'
				// 	},
				// 	body: JSON.stringify({
				// 		message,
				// 		signature
				// 	})
				// });\
				

				 if (!verifyRes.data.verify) throw new Error('Error verifying message');
				// else
				 console.log("It worked! Access token is verified, TODO need to save accessToken in session");

				// It worked! User is signed in with Ethereum
			} catch (error) {
				console.log(error, 'yawaaa!');
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


