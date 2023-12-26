import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react'
import scoresAbi from '../public/scores_abi.json';

const scores_address = "0";

const USDCAddress = "0xd35CCeEAD182dcee0F148EbaC9447DA2c4D449c4";
const USDCAbi = [
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
      const ethersProvider =  new ethers.providers.Web3Provider(walletProvider)
      const signer = ethersProvider.getSigner()
      // The Contract object
      const scoresContract = new ethers.Contract(USDCAddress, USDCAbi, signer)
      const USDTBalance = await scoresContract.balanceOf(address)
      console.log(ethers.utils.formatUnits(USDTBalance, 18))
    }
    
    return (
      <button onClick={pushScore}>Get User Balance</button>
    )
};

export default Scores;
