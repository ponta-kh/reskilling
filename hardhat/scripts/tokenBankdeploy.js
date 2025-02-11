const fs = require("fs");
require("dotenv").config();
const memberNFTAddress = require("../memberNFTContract");

const main = async () => {
    const addr1 = process.env.ADDR_1;
    const addr2 = process.env.ADDR_2;
    const addr3 = process.env.ADDR_3;
    const addr4 = process.env.ADDR_4;

    // デプロイ
    const TokenBank = await ethers.getContractFactory("TokenBank");
    const tokenBank = await TokenBank.deploy("TokenBank", "TBK", memberNFTAddress);
    await tokenBank.deployed();
    console.log(`Contract deployed to: https://sepolia.etherscan.io/address/${tokenBank.address}`);

    // トークンを移転する
    let tx = await tokenBank.transfer(addr2, 300);
    await tx.wait();
    console.log("transferred to addr2");
    tx = await tokenBank.transfer(addr3, 200);
    await tx.wait();
    console.log("transferred to addr3");
    tx = await tokenBank.transfer(addr4, 100);
    await tx.wait();
    console.log("transferred to addr4");

    // Verifyで読み込むargument.jsを生成
    fs.writeFileSync(
        "./argument.js",
        `
    module.exports = [
        "TokenBank",
        "TBK",
        "${memberNFTAddress}"
    ]
    `
    );

    // フロントエンドアプリが読み込むcontracts.jsを生成
    fs.writeFileSync(
        "./contracts.js",
        `
    export const memberNFTAddress = "${memberNFTAddress}"
    export const tokenBankAddress = "${tokenBank.address}"
    `
    );
};

const tokenBankDeploy = async () => {
    try {
        await main();
        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

tokenBankDeploy();
