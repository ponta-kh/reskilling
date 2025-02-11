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

        //一時的な記述
        setAddress("0x4b7be4F74807A7460E0EE092dd9a26F36FbcD024");
        setTokenBalance("100");
        setBankBalance("300");
        setIsVip(true);
        setNftItems([]);
        const metadata = await fetch(
            "https://ipfs.io/ipfs/bafybeigyod7ldrnytkzrw45gw2tjksdct6qaxnsc7jdihegpnk2kskpt7a/metadata2.json"
        ).then((res) => res.json());
        const newItem = {
            name: metadata.name,
            description: metadata.description,
            tokenId: 1,
            src: metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
            alt: metadata.name,
            rare: true,
        };
        setNftItems((prev) => [...prev, newItem]);

        const metadata2 = await fetch(
            "https://ipfs.io/ipfs/bafybeigyod7ldrnytkzrw45gw2tjksdct6qaxnsc7jdihegpnk2kskpt7a/metadata3.json"
        ).then((res) => res.json());
        const newItem2 = {
            name: metadata2.name,
            description: metadata2.description,
            tokenId: 2,
            src: metadata2.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
            alt: metadata2.name,
            rare: false,
        };
        setNftItems((prev) => [...prev, newItem2]);
        //一時的な記述ここまで

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
            process.env.NEXT_PUBLIC_TOKEN_BANK_ADDRESS!,
            TokenBank.abi,
            signer
        );
        setTokenBalance(await tokenBankContract.balanceOf(address).toNumber());
        setBankBalance(await tokenBankContract.bankBalanceOf(address).toNumber());
        setBankTotalDeposit(await tokenBankContract.bankTotalDeposit().toNumber());

        const memberNFTContract = new ethers.Contract(
            process.env.NEXT_PUBLIC_MEMBER_NFT_ADDRESS!,
            MemberNFT.abi,
            signer
        );

        for (let i = 0; i < (await memberNFTContract.balanceOf(address)); i++) {
            const tokenId = await memberNFTContract.tokenOfOwnerByIndex(address, i);
            const uri = await memberNFTContract
                .tokenURI(tokenId)
                .replace("ipfs://", "https://ipfs.io/ipfs/");
            const metadata = await fetch(uri).then((res) => res.json());
            const nftItem = {
                name: metadata.name,
                description: metadata.description,
                tokenId: tokenId.toNumber(),
                src: metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
                alt: metadata.name,
                rare: true,
            };
            setNftItems((prev) => [...prev, nftItem]);
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
