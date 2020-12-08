const path = require('path')
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "vapp/src/contracts"),

  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    }
  },

  compilers: {
    solc: {
      version: "0.6.8"    // Fetch exact version from solc-bin (default: truffle's version)
    },
  },

};
