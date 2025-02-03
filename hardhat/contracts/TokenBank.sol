// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

interface MemberToken {
    function balanceOf(address owner) external view returns (uint256);
}

contract TokenBank {
    MemberToken public memberToken;

    /// @dev Tokenの名前
    string private _name;

    /// @dev Tokenのシンボル
    string private _symbol;

    /// @dev Tokenの総供給量
    uint256 constant _totalSupply = 1000;

    /// @dev TokenBankが保有している総額
    uint256 private _bankTotalDeposit;

    /// @dev TokenBankのオーナー
    address public owner;

    /// @dev アカウントアドレス毎のToken残高
    mapping(address => uint256) private _balances;

    /// @dev TokenBankが預かっているToken残高
    mapping(address => uint256) private _tokenBankBalances;

    /// @dev Token移転時のイベント
    event TokenTransfer(
        address indexed from, 
        address indexed to, 
        uint256 amount
    );

    /// @dev Token預け入れ時のイベント
    event TokenDeposit(
        address indexed from, 
        uint256 amount
    );

    /// @dev Token引き出し時のイベント
    event TokenWithdraw(
        address indexed to, 
        uint256 amount
    );

    /// @dev コンストラクタの場合は保存しなくてもmemoryを使用
    constructor(
        string memory name_, 
        string memory symbol_,
        address nftContact_
    ) {
        _name = name_;
        _symbol = symbol_;
        owner = msg.sender;
        _balances[msg.sender] = _totalSupply;
        memberToken = MemberToken(nftContact_);
    }

    /// @dev NFTメンバーのみ
    modifier onlyMember(){
        require(memberToken.balanceOf(msg.sender) > 0, "TokenBank: only member");
        _;
    }

    /// @dev オーナー以外
    modifier notOwner(){
        require(owner != msg.sender, "TokenBank: Owner cannot execute");
        _;
    }

    /// @dev Tokenの名前を返す
    function name() public view returns (string memory) {
        return _name;
    }

    /// @dev Tokenのシンボルを返す  
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    /* @dev 
     * - Tokenの総供給量を返す
     * - 定数を返すためpureを使用
     */
    function totalSupply() public pure returns (uint256) {
        return _totalSupply;
    }

    /// @dev 指定アカウントアドレスの残高を返す
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    /// @dev Token移転
    function transfer(address to, uint256 amount) public onlyMember{
        if (owner == msg.sender) {
            require(
                _balances[owner] - _bankTotalDeposit >= amount, 
                "TokenBank: transfer amount exceeds balance"
            );
        }
        address from = msg.sender;
        _transfer(from, to, amount);
    }

    function _transfer(
        address from, 
        address to, 
        uint256 amount
    ) internal {
        require(to != address(0), "TokenBank: transfer to zero address");
        require(_balances[from] >= amount, "TokenBank: transfer amount exceeds balance");

        _balances[from] -= amount;
        _balances[to] += amount;

        // イベントの実行
        emit TokenTransfer(from, to, amount);
    }

    /// @dev TokenBankが預かっているTokenの総額を返す
    function bankTotalDeposit() public view returns (uint256){
        return _bankTotalDeposit;
    }

    /// @dev TokenBankが預かっている指定のアカウントアドレスのTokenの総額を返す
    function bankBalanceOf(address account) public view returns (uint256){
        return _tokenBankBalances[account];
    }

    /// @dev Tokenを預ける
    function deposit(uint256 amount) public onlyMember notOwner{
        address from = msg.sender;
        address to = owner;

        _transfer(from, to, amount);

        _tokenBankBalances[from] += amount;
        _bankTotalDeposit += amount;

        // イベントの実行
        emit TokenDeposit(from, amount);
    }

    /// @dev Tokenを引き出す
    function withdraw(uint256 amount) public onlyMember notOwner{
        address to = msg.sender;
        address from = owner;
        uint256 toTokenBankBalance = _tokenBankBalances[to];
        
        require(toTokenBankBalance >= amount, "TokenBank: withdraw amount exceeds balance");

        _transfer(from, to, amount);

        _tokenBankBalances[to] -= amount;
        _bankTotalDeposit -= amount;

        // イベントの実行
        emit TokenWithdraw(to, amount);
        
    }
}