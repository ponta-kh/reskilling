const fs = require("fs");
require("dotenv").config();

const main = async () => {
    const addr1 = process.env.ADDR_1;
    const addr2 = process.env.ADDR_2;
    const addr3 = process.env.ADDR_3;

    const tokenURI1 = `${process.env.TOKEN_URI}/metadata1.json`;
    const tokenURI2 = `${process.env.TOKEN_URI}/metadata2.json`;
    const tokenURI3 = `${process.env.TOKEN_URI}/metadata3.json`;
    const tokenURI4 = `${process.env.TOKEN_URI}/metadata4.json`;
    const tokenURI5 = `${process.env.TOKEN_URI}/metadata5.json`;

    // デプロイ
    const MemberNFT = await ethers.getContractFactory("MemberNFT");
    const memberNFT = await MemberNFT.deploy();
    await memberNFT.deployed();

    console.log(`Contract deployed to: https://sepolia.etherscan.io/address/${memberNFT.address}`);

    // NFTをmintする
    let tx = await memberNFT.nftMint(addr1, tokenURI1);
    await tx.wait();
    console.log("NFT#1 minted...");
    tx = await memberNFT.nftMint(addr1, tokenURI2);
    await tx.wait();
    console.log("NFT#2 minted...");
    tx = await memberNFT.nftMint(addr2, tokenURI3);
    await tx.wait();
    console.log("NFT#3 minted...");
    tx = await memberNFT.nftMint(addr2, tokenURI4);
    await tx.wait();
    console.log("NFT#4 minted...");

    // コントラクトアドレスの書き出し
    fs.writeFileSync(
        "./memberNFTContract.js",
        `
    module.exports = "${memberNFT.address}"
    `
    );
};

const memberNFTDeploy = async () => {
    try {
        await main();
        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

memberNFTDeploy();
