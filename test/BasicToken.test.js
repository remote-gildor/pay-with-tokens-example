const BasicToken = artifacts.require("BasicToken");

contract("BasicToken", accounts => {

  describe("Token specs", () => {

    it("has the correct name", async () => {

      const inst = await BasicToken.deployed();
      const name = await inst.name();
      assert.equal(name, "Basic Token");

    });

    it("has the correct symbol", async () => {

      const inst = await BasicToken.deployed();
      const symbol = await inst.symbol();
      assert.equal(symbol, "BT");

    });

    it("has the correct number of decimals", async () => {

      const inst = await BasicToken.deployed();
      const decimals = await inst.decimals();
      assert.equal(decimals, 18);

    });

  });

  describe("Token holder", () => {

    it("has the correct token amount", async () => {

      const inst = await BasicToken.deployed();
      const balance = await inst.balanceOf(accounts[0]);
      assert.equal(balance, web3.utils.toWei("10000", 'ether')); // 10 thousand tokens

    });
  });

});
