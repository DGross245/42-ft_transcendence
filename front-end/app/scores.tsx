"use client"

import { ethers } from 'ethers';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react'
import scoresAbi from '../public/scores_abi.json';
import erc20Abi from '../public/erc20_abi.json';

const USDCAddress = '0xd35CCeEAD182dcee0F148EbaC9447DA2c4D449c4'

const USDTAbi = [
	"function name() view returns (string)",
	"function symbol() view returns (string)",
	"function balanceOf(address) view returns (uint)",
	"function transfer(address to, uint amount)",
	"event Transfer(address indexed from, address indexed to, uint amount)"
  ];

function Scores() {
	const { address, chainId, isConnected } = useWeb3ModalAccount()
	const { walletProvider } = useWeb3ModalProvider()

	async function pushScore(){
		if (!isConnected) throw Error("User disconnected")
		if (!walletProvider) throw Error("No wallet provider found")

		const provider =  new ethers.providers.Web3Provider(walletProvider)
		const signer = provider.getSigner()
		const address = await signer.getAddress()

		const network = await provider.getNetwork()
		console.log(network)

		const scoresContract = new ethers.Contract(USDCAddress, erc20Abi, signer)
		console.log(scoresContract)
		const USDTBalance = await scoresContract.balanceOf("0x88593107342E073fDB8C54Aab81933942F1C0BED")
		console.log(USDTBalance)
		console.log("1")
	}

	return (
		<button onClick={pushScore}>Get User Balance</button>
	)
};

export default Scores;
