require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomicfoundation/hardhat-verify");
require("hardhat-gas-reporter");
require("solidity-coverage");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  etherscan: {
    apiKey: process.env.ETHERSCAN_API,
  },
  gasReporter: {
    enabled: true,
    noColors: true,
    outputFile: "gas-reporter.txt",
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API,
  },
  networks: {
    arbtestnet: {
      url: process.env.ARB_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 421613,
    },
    sepolia: {
      url: process.env.SEP_RPC_URL,
      accounts: [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY1, process.env.PRIVATE_KEY2],
      chainId: 11155111,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
  },
  solidity: "0.8.20",
};
