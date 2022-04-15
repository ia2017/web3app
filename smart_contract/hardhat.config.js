// https://eth-ropsten.alchemyapi.io/v2/huCzfnWjyLybrMXPyfVR5yBBvhtjnz4H

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten:{
      url: 'https://eth-ropsten.alchemyapi.io/v2/huCzfnWjyLybrMXPyfVR5yBBvhtjnz4H',
      accounts: ['b5b6d0ef8c2cbe8ac0cfa57f4c0ee0dc0015df16e2be10905c570e67843dbeee']
    }
  }
}