const {expect} = require("chai");
const { ethers } = require("hardhat");

describe("TokenBankコントラクト", function(){
    let MemberNFT;
    let memberNFT;
    const tokenURI1 = "hoge1";
    const tokenURI2 = "hoge2";
    const tokenURI3 = "hoge3";
    const tokenURI4 = "hoge4";
    const tokenURI5 = "hoge5";

    let TokenBank;
    let tokenBank;

    const name = "Token";
    const symbol = "TBK";
    let owner;
    let addr1;
    let addr2;
    let addr3;
    const zeroAddress = "0x0000000000000000000000000000000000000000";

    beforeEach(async function(){
        [owner, addr1, addr2, addr3] = await ethers.getSigners();
        MemberNFT = await ethers.getContractFactory("MemberNFT");
        memberNFT = await MemberNFT.deploy();
        await memberNFT.deployed();
        await memberNFT.nftMint(owner.address, tokenURI1);
        await memberNFT.nftMint(addr1.address, tokenURI2);
        await memberNFT.nftMint(addr1.address, tokenURI3);
        await memberNFT.nftMint(addr2.address, tokenURI4);

        TokenBank = await ethers.getContractFactory("TokenBank");
        tokenBank = await TokenBank.deploy(name, symbol, memberNFT.address);
        await tokenBank.deployed();
    });

    describe("デプロイ", function(){
        it("トークン名称・シンボルがセットされている", async function(){
            expect(await tokenBank.name()).to.equal(name);
            expect(await tokenBank.symbol()).to.equal(symbol);
        });
        it("デプロイアドレスがownerと一致", async function(){
            expect(await tokenBank.owner()).to.equal(owner.address);
        });
        it("ownerに総額が割り当てられている", async function(){
            const ownerBalance = await tokenBank.balanceOf(owner.address);
            expect(await tokenBank.totalSupply()).to.equal(ownerBalance);
        });
        it("預かっているTokenの総量が0である", async function(){
            expect(await tokenBank.bankTotalDeposit()).to.equal(0);
        });
    });

    describe("アドレス間トランザクション", function(){
        beforeEach(async function(){
            await tokenBank.transfer(addr1.address, 500);
        });

        it("トークン移転がされている", async function(){
            const startAddr1Balance = await tokenBank.balanceOf(addr1.address);
            const startAddr2Balance = await tokenBank.balanceOf(addr2.address);

            await tokenBank.connect(addr1).transfer(addr2.address, 100);

            const endAddr1Balance = await tokenBank.balanceOf(addr1.address);
            const endAddr2Balance = await tokenBank.balanceOf(addr2.address);

            expect(endAddr1Balance).to.equal(startAddr1Balance.sub(100));
            expect(endAddr2Balance).to.equal(startAddr2Balance.add(100));
        });
        it("ゼロアドレス宛の移転はエラーとなる", async function(){
            await expect(tokenBank.transfer(zeroAddress, 100))
            .to.be.revertedWith("TokenBank: transfer to zero address");
        });
        it("残高不足は移転に失敗する", async function(){
            await expect(tokenBank.connect(addr1).transfer(addr2.address, 510))
            .to.be.revertedWith("TokenBank: transfer amount exceeds balance");
        });
        it("移転後にTokenTransferイベントが発行される", async function(){
            await expect(tokenBank.connect(addr1).transfer(addr2.address, 100))
            .emit(tokenBank, "TokenTransfer").withArgs(addr1.address, addr2.address, 100);
        });
    });

    describe("Bankトランザクション", function(){
        beforeEach(async function(){
            await tokenBank.transfer(addr1.address, 500);
            await tokenBank.transfer(addr2.address, 200);
            await tokenBank.transfer(addr3.address, 100);
            await tokenBank.connect(addr1).deposit(100);
            await tokenBank.connect(addr2).deposit(200);
        });
        it("トークン預け入れ機能が実行できる", async function(){
            const addr1Balance = await tokenBank.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(400);

            const addr1bankBalance = await tokenBank.bankBalanceOf(addr1.address);
            expect(addr1bankBalance).to.equal(100);
        });
        it("預け入れもToken移転ができる", async function(){
            const startAddr1Balance = await tokenBank.balanceOf(addr1.address);
            const startAddr2Balance = await tokenBank.balanceOf(addr2.address);

            await tokenBank.connect(addr1).transfer(addr2.address, 100);

            const endAddr1Balance = await tokenBank.balanceOf(addr1.address);
            const endAddr2Balance = await tokenBank.balanceOf(addr2.address);

            expect(endAddr1Balance).to.equal(startAddr1Balance.sub(100));
            expect(endAddr2Balance).to.equal(startAddr2Balance.add(100));
        });
        it("TokenDepositイベントが実行される", async function(){
            await expect(tokenBank.connect(addr1).deposit(100))
            .emit(tokenBank, "TokenDeposit").withArgs(addr1.address, 100);
        });
        it("Token引き出しが実行されるべき", async function(){
            const startBankBalance = await tokenBank.connect(addr1).bankBalanceOf(addr1.address);
            const startTotalBankBalance = await tokenBank.connect(addr1).bankTotalDeposit();

            await tokenBank.connect(addr1).withdraw(100);

            const endBankBalance = await tokenBank.connect(addr1).bankBalanceOf(addr1.address);
            const endTotalBankBalance = await tokenBank.connect(addr1).bankTotalDeposit();

            expect(endBankBalance).to.equal(startBankBalance.sub(100));
            expect(endTotalBankBalance).to.equal(startTotalBankBalance.sub(100));
        });
        it("預け入れトークンが不足していれば、引き出しに失敗する", async function(){
            await expect(tokenBank.connect(addr1).withdraw(101))
            .to.be.revertedWith("TokenBank: withdraw amount exceeds balance");
        });
        it("TokenWithdrawイベントが実行される", async function(){
            await expect(tokenBank.connect(addr1).withdraw(100))
            .emit(tokenBank, "TokenWithdraw").withArgs(addr1.address, 100);
        });

        it("オーナーによる預け入れは失敗すべき", async function(){
            await expect(tokenBank.deposit(1))
            .to.be.revertedWith("TokenBank: Owner cannot execute");
        });
        it("オーナーによる引き出しは失敗すべき", async function(){
            await expect(tokenBank.withdraw(1))
            .to.be.revertedWith("TokenBank: Owner cannot execute");
        });
        it("トータル預け入れトークン数より大きい数はオーナーであっても失敗すべき", async function(){
            await expect(tokenBank.transfer(addr1.address, 201))
            .to.be.revertedWith("TokenBank: transfer amount exceeds balance");
        });
        it("NFTメンバー以外の移転は失敗すべき", async function(){
            await expect(tokenBank.connect(addr3).transfer(addr1.address, 1))
            .to.be.revertedWith("TokenBank: only member");
        });
        it("NFTメンバー以外の預け入れは失敗すべき", async function(){
            await expect(tokenBank.connect(addr3).deposit(1))
            .to.be.revertedWith("TokenBank: only member");
        });
        it("NFTメンバー以外の引き出しは失敗すべき", async function(){
            await expect(tokenBank.connect(addr3).withdraw(1))
            .to.be.revertedWith("TokenBank: only member");
        });
    });
})