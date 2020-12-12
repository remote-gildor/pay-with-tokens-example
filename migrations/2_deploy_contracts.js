const BasicToken = artifacts.require("BasicToken");
const SomeService = artifacts.require("SomeService");
const TokenWithPermit = artifacts.require("TokenWithPermit");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(BasicToken);
  deployer.deploy(TokenWithPermit, accounts[1]); // the second account should get all tokens
  deployer.deploy(SomeService);
};
