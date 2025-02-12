"use client";
import { useState } from "react";
import { ethers } from "ethers";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import MemberNFT from "@contracts/MemberNFT.json";
import TokenBank from "@contracts/TokenBank.json";

import TopPageLogo from "@/components/custom/topPageLogo";

import ProfileCard from "@/features/profileCard";
import TransferForm from "@/features/transferForm";
import DepositForm from "@/features/depositForm";
import DrawForm from "@/features/drawForm";
import NftItem from "@/features/nftItem";

interface Item {
    name: string;
    description: string;
    tokenId: number;
    src: string;
    alt: string;
    rare: boolean;
}

export default function Home() {
    //SepoliaのチェーンID
    const chainId = "0xaa36a7";

    const [address, setAddress] = useState("");
    const [tokenBalance, setTokenBalance] = useState("");
    const [bankBalance, setBankBalance] = useState("");
    const [bankTotalDeposit, setBankTotalDeposit] = useState("");
    const [nftItems, setNftItems] = useState<Item[]>([]);
    const [isVip, setIsVip] = useState(false);

    //MetaMask情報取得
    const checkMetaMaskAccount = async () => {
        //MetaMaskはブラウザの拡張機能として機能しているため、ここではwindowを通して扱う
        //型指定の方法がわからないので、anyで回避
        const { ethereum } = window as any;

        if (!ethereum) {
            alert("MetaMaskをインストールしてください！");
            return;
        }

        if ((await ethereum.request({ method: "eth_chainId" })) != chainId) {
            alert("Sepoliaに接続してください!");
            return;
        }

        const accounts = await ethereum.request({
            method: "eth_requestAccounts",
        });
        setAddress(accounts[0]);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const tokenBankContract = new ethers.Contract(
            "0x3b54000195e80461FA44eE64653021d99910344B",
            TokenBank.abi,
            signer
        );
        setTokenBalance((await tokenBankContract.balanceOf(accounts[0])).toNumber());
        setBankBalance((await tokenBankContract.bankBalanceOf(accounts[0])).toNumber());
        setBankTotalDeposit((await tokenBankContract.bankTotalDeposit()).toNumber());

        const memberNFTContract = new ethers.Contract(
            "0x42573E5c506A56255883983f7C7e365B8aC69104",
            MemberNFT.abi,
            signer
        );

        for (let i = 0; i < (await memberNFTContract.balanceOf(accounts[0])); i++) {
            const tokenId = await memberNFTContract.tokenOfOwnerByIndex(accounts[0], i);
            const uri = (await memberNFTContract.tokenURI(tokenId)).replace(
                "ipfs://",
                "https://ipfs.io/ipfs/"
            );
            console.log(uri);
            const metadata = await fetch(uri).then((res) => res.json());
            const rare = metadata.attributes.some(
                (attr: any) => attr.trait_type === "Jump" && attr.value > 800
            );
            const nftItem = {
                name: metadata.name,
                description: metadata.description,
                tokenId: tokenId.toNumber(),
                src: metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
                alt: metadata.name,
                rare: rare,
            };
            setNftItems((prev) => [...prev, nftItem]);
            if (rare) {
                setIsVip(true);
            }
        }
    };

    const disconnectMetaMask = async () => {
        setAddress("");
        setTokenBalance("");
        setBankBalance("");
        setBankTotalDeposit("");
        setNftItems([]);
        setIsVip(false);
    };

    const cardProps = {
        address: address,
        tokenBalance: tokenBalance,
        bankBalance: bankBalance,
    };

    return (
        <>
            <div className="bg-blue-50 min-h-screen text-gray-800 py-16 px-4 sm:px-6 lg:px-8">
                <div className="text-center mt-8 mb-12">
                    <h1 className="text-4xl font-bold text-gold-500 mb-4">
                        PontaNFTコミュニティサイトへようこそ！
                    </h1>
                    {/* <TopPageLogo /> */}
                </div>

                {address ? (
                    <div className="space-y-8">
                        <div className="max-w-4xl mx-auto">
                            <ProfileCard {...cardProps} />
                        </div>

                        <div className="max-w-4xl mx-auto space-y-6">
                            <TransferForm />
                            <DepositForm />
                            <DrawForm />
                        </div>

                        <div className="flex justify-center flex-wrap gap-4">
                            {nftItems.map((item, index) => (
                                <NftItem key={index} {...item} />
                            ))}
                        </div>

                        <div className="w-96 mx-auto space-y-4 mt-8">
                            <Button
                                variant="destructive"
                                onClick={disconnectMetaMask}
                                className="w-full"
                            >
                                接続解除
                            </Button>
                        </div>
                        {isVip ? (
                            <div className="w-96 mx-auto mt-6">
                                <Link
                                    href="/vip"
                                    className="inline-block px-6 py-3 bg-gold-500 text-black rounded-full text-lg w-full text-center"
                                >
                                    VIPページへ
                                </Link>
                            </div>
                        ) : null}
                    </div>
                ) : (
                    <div className="w-96 mx-auto mt-8">
                        <Button variant="primary" onClick={checkMetaMaskAccount} className="w-full">
                            MetaMaskを接続
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
