"use client";
import { Button } from "@/components/shadcn/button";
import { useState } from 'react';

import TopPageLogo from "@/components/custom/topPageLogo";

import ProfileCard from "@/features/profileCard";
import TransferForm from "@/features/transferForm";
import DepositForm from "@/features/depositForm";
import DrawForm from "@/features/drawForm";

export default function Home() {
  const assetsId = '0xaa36a7';

  const [address, setAddress] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");
  const [bankBalance, setBankBalance] = useState("");
  
  const checkMetaMaskAccount = async () => {
    const { ethereum } = window as any;

    if (!ethereum) {
      alert("MetaMaskをインストールしてください！");
    } else{
      const chain = await ethereum.request({
        method: 'eth_chainId'
      });

      if (chain != assetsId) {
        alert("Sepoliaに接続してください!");
        return;

      } else {
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts'
        });
        setAddress(accounts[0]);
        setTokenBalance("200");
        setBankBalance("100");
      }
    }
  }

  const disconnectMetaMask = async () => {
    setAddress("");
    setTokenBalance("");
    setBankBalance("");
  };

  return (
    <>
      <h1>トークンコミュニティへようこそ！</h1>
      <TopPageLogo />
      {address ? <ProfileCard address={address} tokenBalance={tokenBalance} bankBalance={bankBalance}/> : null}
      {address 
        ? <>
            <TransferForm />
            <DepositForm />
            <DrawForm />
          </>
        : null
      }
      
      <div className="w-96 m-auto">
        {address ? <Button variant="destructive" onClick={disconnectMetaMask}>接続解除</Button> : <Button variant="primary" onClick={checkMetaMaskAccount}>MetaMaskを接続</Button> }
      </div>
    </>
  );
}
