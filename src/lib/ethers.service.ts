import {
	TypedDataDomain,
	TypedDataField
} from '@ethersproject/abstract-signer';
import { ethers, utils, Wallet } from 'ethers';
import { omit } from './helpers';

// export const ethersProvider = new ethers.providers.JsonRpcProvider(
// 	// process.env.MUMBAI_RPC_URL
// 	'https://rpc-mumbai.maticvigil.com'
// );

// export const getSigner = () => {
// 	return new Wallet(process.env.PK, ethersProvider);
// };

export async function getProvider() {
	if (window.ethereum) {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		await provider.send('eth_requestAccounts', []);
		return provider;
	}
}

export async function getSigner() {
	const provider = await getProvider();
	return provider.getSigner();
}

export async function getSignerAddress() {
	const signer = await getSigner();
	const address = await signer.getAddress();
	return address;
}
export const getAddressFromSigner = () => {
	return getSigner().address;
};

export const signedTypeData = (
	domain: TypedDataDomain,
	types: Record<string, TypedDataField[]>,
	value: Record<string, any>
) => {
	const signer = getSigner();
	// remove the __typedname from the signature!
	return signer._signTypedData(
		omit(domain, '__typename'),
		omit(types, '__typename'),
		omit(value, '__typename')
	);
};

export const splitSignature = (signature: string) => {
	return utils.splitSignature(signature);
};

export const sendTx = (
	transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest>
) => {
	const signer = getSigner();
	return signer.sendTransaction(transaction);
};

export const signText = async(text: string) => {
	const signer = await getSigner();
	return signer.signMessage(text);
};
