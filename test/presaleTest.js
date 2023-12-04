const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Token Contract", function () {
  let Token;
  let token;
  let owner;
  let addr1;
  let addr2;
  let tokenAddress;

  const softCap = "100";
  const hardCap = "1000";
  const tier1Price = 1;
  const tier2Price = 2;
  const tier3Price = 3;

  beforeEach("It should deploy the contract", async function () {
    Token = await ethers.getContractFactory("Token");
    [owner, addr1, addr2] = await ethers.getSigners();

    token = await Token.deploy(softCap, hardCap, tier1Price, tier2Price, tier3Price);
    await token.waitForDeployment();
    tokenAddress = token.target;
  });

  it("Deployment should assign the initial supply of tokens to the contract", async function () {
    const totalSupply = await token.totalSupply();
    expect(await token.balanceOf(tokenAddress)).to.equal(totalSupply);
  });

  it("Owner should be set correctly", async function () {
    expect(await token.owner()).to.equal(owner.address);
  });

  it("Setting tier prices should work correctly", async function () {
    const newTier1Price = 5;
    const newTier2Price = 10;
    const newTier3Price = 15;

    await token.connect(owner).setTierPrices(newTier1Price, newTier2Price, newTier3Price);

    expect(await token.tier1Price()).to.equal(newTier1Price);
    expect(await token.tier2Price()).to.equal(newTier2Price);
    expect(await token.tier3Price()).to.equal(newTier3Price);
  });

  it("Buying tokens should work correctly", async function () {
    const amount = 100;
    await token.connect(addr1).buyTokens(amount, { value: amount * tier1Price });

    expect(await token.tokensSold()).to.equal(amount);
    expect(await token.totalContribution()).to.equal(amount * tier1Price);
    expect(await token.presaleTokensPurchased(addr1.address)).to.equal(amount);
  });

  it("Withdraw funds should work correctly", async function () {
    const amount = 1000;
    await token.connect(addr1).buyTokens(amount, { value: amount * tier1Price });

    const initialBalance = await ethers.provider.getBalance(owner.address);
    await token.connect(owner).withdrawFunds();
    const finalBalance = await ethers.provider.getBalance(owner.address);

    expect(finalBalance).to.not.equal(initialBalance);
  });

  it("Should revert when user calls the withdraw function", async function () {
    await expect(token.connect(addr1).withdrawFunds()).to.be.revertedWith("Only the owner can call this function");
  })

  it("Should not exceed hardcap", async function () {
    const amount = hardCap + 1;
    await expect(token.connect(addr1).buyTokens(amount, { value: amount * tier1Price })).to.be.revertedWith(
      "Hardcap reached"
    );
  });

});
