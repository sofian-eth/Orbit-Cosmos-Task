// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./ERC20.sol";

contract Token is ERC20 {
    address public owner;
    uint256 public totalContribution;
    uint256 public softCap;
    uint256 public hardCap;
    uint256 public tier1Price;
    uint256 public tier2Price;
    uint256 public tier3Price;
    uint256 public tokensSold;
    uint256 public constant tokensForPresale = 1000000 * (10 ** 18);
    IERC20 token = IERC20(address(this));

    mapping(address => uint256) public presaleTokensPurchased;

    constructor(
        uint256 _softCap,
        uint256 _hardCap,
        uint256 _tier1Price,
        uint256 _tier2Price,
        uint256 _tier3Price
    ) ERC20("Orbit Cosmos", "OC") {
        require(_hardCap > _softCap, "softcap cannot be greater than hardcap");
        _mint(address(this), 1000000 * 10 ** decimals());
        owner = msg.sender;
        softCap = _softCap;
        hardCap = _hardCap;
        tier1Price = _tier1Price;
        tier2Price = _tier2Price;
        tier3Price = _tier3Price;
    }

    receive() external payable {}

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function setTierPrices(
        uint256 _tier1Price,
        uint256 _tier2Price,
        uint256 _tier3Price
    ) external onlyOwner {
        tier1Price = _tier1Price;
        tier2Price = _tier2Price;
        tier3Price = _tier3Price;
    }

    function buyTokens(uint256 _amount) external payable {
        require(_amount > 0, "Amount cannot be 0");
        require(
            tokensSold + _amount <= tokensForPresale,
            "Presale limit exceeded"
        );
        require(totalContribution + msg.value <= hardCap, "Hardcap reached");

        //performing calculations based on the amount of tokens being purchased

        uint256 totalPrice = 0;

        if (_amount < 50000 * (10 ** 18)) {
            totalPrice = (_amount * tier1Price) / 1 ether;
        } else if (
            _amount > 50000 * (10 ** 18) && _amount < 100000 * (10 ** 18)
        ) {
            totalPrice = (_amount * tier2Price) / 1 ether;
        } else {
            totalPrice = (_amount * tier3Price) / 1 ether;
        }

        require(msg.value >= totalPrice, "Insufficient Funds");

        tokensSold += _amount;
        totalContribution += msg.value;
        presaleTokensPurchased[msg.sender] += _amount;

        token.transfer(msg.sender, _amount);
    }

    function withdrawFunds() external onlyOwner {
        uint256 bal = address(this).balance;
        require(bal > 0, "No balance to withdraw");

        (bool success, ) = payable(owner).call{value: bal}("");

        require(success, "Transfer failed");
    }
}
