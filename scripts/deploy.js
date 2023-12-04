const { ethers } = require("hardhat");

const main = async () => {

  const softCap = ethers.parseEther("1");
  const hardCap = ethers.parseEther("10");
  const tier1Price = ethers.parseEther("0.001");
  const tier2Price = ethers.parseEther("0.0005");
  const tier3Price = ethers.parseEther("0.0001");

  console.log(`Deploying presale contract...`)

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy(softCap, hardCap, tier1Price, tier2Price, tier3Price);

  await token.waitForDeployment();

  console.log(`presale contract deployed to: ${token.target}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });