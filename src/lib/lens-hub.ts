import { ethers } from 'ethers';
import { getSigner } from './ethers.service';

// lens contract info can all be found on the deployed
// contract address on polygon.
export const lensHub = new ethers.Contract(
	process.env.LENS_HUB_CONTRACT,
	process.env.LENS_HUB_ABI,
	getSigner()
);
