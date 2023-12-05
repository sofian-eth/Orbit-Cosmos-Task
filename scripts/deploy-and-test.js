const { ethers } = require("hardhat");

const main = async () => {
    
 [owner, addr1, addr2] = await ethers.getSigners();

  const softCap = ethers.parseEther("0.1");
  const hardCap = ethers.parseEther("1");
  const tier1Price = ethers.parseEther("0.001");
  const tier2Price = ethers.parseEther("0.0005");
  const tier3Price = ethers.parseEther("0.0001");

  console.log(`Deploying presale contract...`)

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy(softCap, hardCap, tier1Price, tier2Price, tier3Price);

  await token.waitForDeployment();

  console.log(`presale contract deployed to: ${token.target}`);

  const totalSupply = await token.totalSupply();
  const testSupply = await token.balanceOf(token.target);

  if(totalSupply == testSupply) {
    console.log(`Test Passed! Total Supply = Test Supply`);
  }
  else {
    console.log(`Total supply != test supply. Test failed`);
  }

  const testOwner = await token.owner();
  if(testOwner == owner.address) {
    console.log(`Test passed. Owner = test Owner`);
  }
  else {
    console.log(`Test Failed. owner != test Owner`);
  }

  const newtier1Price = ethers.parseEther("0.00002");
  const newtier2Price = ethers.parseEther("0.00006");
  const newtier3Price = ethers.parseEther("0.000015");

  console.log('Testing: Set tier prices...')

  const tx = await token.setTierPrices(newtier1Price, newtier2Price, newtier3Price);

  await tx.wait();

  console.log(`success! Test passed`);

  const amount = "5000";

  console.log(`Attempting to buy tokens and testing...`)

  const tx2 = await token.connect(addr1).buyTokens(ethers.parseEther(amount), { value: ethers.parseEther("0.11") });

  await tx2.wait();

  const buyTest = await token.balanceOf(addr1.address);

  if(buyTest == ethers.parseEther(amount)) {
    console.log(`Buy test passed!`);
  }
  else {
    console.log(`Buy Test failed!!!`);
  }


  console.log(`Attempting to withdraw funds...`)

  const initBalance = await ethers.provider.getBalance(owner.address);

  console.log(`Initial balance = ${ethers.formatEther(initBalance)}`);

  const tx3 = await token.connect(owner).withdrawFunds();

  await tx3.wait(2);

  const finalBalance = await ethers.provider.getBalance(owner.address);

  console.log(`Final Balance = ${ethers.formatEther(finalBalance)}`);

  if(initBalance != finalBalance) {
    console.log(`Test passed! initial balance != Final balance`);
  }
  else {
    console.log(`test failed! Final balance = initial balance`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });