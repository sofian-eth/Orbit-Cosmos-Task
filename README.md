# Testable Presale Smart Contract with Gas Fee Optimization via Layer 2 on Testnet

This contract implements a token sale mechanism with predefined tiers and prices. It allows users to buy tokens based on the defined tier pricing. Key features include:

1. Token Sale: Users can purchase tokens using Ether, with different pricing tiers based on the amount being purchased.
2. Presale Limit: There's a limit on the number of tokens that can be sold during presale.
3. Owner Functions: Certain functions are restricted to the contract owner.

## Interacting with the Contract

### Constructor:

1. Initializes the token with the name "Orbit Cosmos" and the symbol "OC".
2. Sets the supply to 1,000,000 tokens.

### Public Functions:

1. setTierPrices(uint256 \_tier1Price, uint256 \_tier2Price, uint256 \_tier3Price): Allows the owner to set or update tier prices.
2. buyTokens(uint256 \_amount): Enables users to purchase tokens based on predefined tier prices.
3. withdrawFunds(): Allows the owner to withdraw Ether from the contract.

### Variables:

1. owner: Address of the contract owner.
2. totalContribution: Total Ether contributed.
3. softCap & hardCap: Presale and maximum contribution limits.
4. tier1Price, tier2Price, tier3Price: Prices for different tiers.
5. tokensSold: Total tokens sold.
6. presaleTokensPurchased: Mapping of user addresses to tokens purchased during presale.

## Deployment using Hardhat

### Follow the steps below

```shell
git clone <repository URL >
cd <project folder >
yarn install
```

Create a .env file and load it with your PRIVATE_KEY and RPC URL

Deploy and test the smart contract using the following commands:

```shell
yarn hardhat run scripts/deploy.js --network <network name >
yarn hardhat test
```

# Thank you
