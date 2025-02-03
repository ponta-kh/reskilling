"use client";
import { Button } from "@/components/shadcn/button";
import { CardComponent, CardComponentProps } from "@/components/shadcn/card";
import { useActionState, useState } from 'react';

import TransferForm from "@/features/transferForm";
import DepositForm from "@/features/depositForm";
import DrawForm from "@/features/drawForm";

export default function Home() {
  const assetsId = '0xaa36a7'
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  const [address, setAddress] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");
  const [bankBalance, setBankBalance] = useState("");

  const cardProps: CardComponentProps = {
    title: "アカウント情報",
    description: "Card Description",
    items: [
      <p key="address">アドレス：{address}</p>,
      <p key="balance">所持残高：{tokenBalance}</p>,
      <p key="deposit">預入残高：{bankBalance}</p>
    ],
    footer: "フッター"
  }
  
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
      <div className='mt-8 mb-16 hover:rotate-180 hover:scale-105 transition duration-700 ease-in-out'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='160'
          height='160'
          viewBox='0 0 350 350'
        >
          <polygon points="0 0, 175 0, 175 175, 0 175" stroke="black" fill="#0000ff" />
          <polygon points="0 175, 175 175, 175 350, 0 350" stroke="black" fill="#ffc0cb" />
          <polygon points="175 0, 350 0, 350 175, 175 175" stroke="black" fill="#90EE90" />
          <polygon points="175 175, 350 175, 350 350, 175 350" stroke="black" fill="#ffff00" />
        </svg>
      </div>
      {address ? <CardComponent {...cardProps}/> : null}
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
