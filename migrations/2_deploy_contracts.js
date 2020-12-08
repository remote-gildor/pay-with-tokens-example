const BasicToken = artifacts.require("BasicToken");
const SomeService = artifacts.require("SomeService");

module.exports = function(deployer) {
  deployer.deploy(BasicToken);
  deployer.deploy(SomeService);
};
