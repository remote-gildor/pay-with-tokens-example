const TokenWithPermit = artifacts.require("TokenWithPermit");

contract("TokenWithPermit", accounts => {

  describe("Token specs", () => {

    it("has the correct name", async () => {

      const inst = await TokenWithPermit.deployed();
      const name = await inst.name();
      assert.equal(name, "Token With Permit");

    });

    it("has the correct symbol", async () => {

      const inst = await TokenWithPermit.deployed();
      const symbol = await inst.symbol();
      assert.equal(symbol, "TWP");

    });

    it("has the correct number of decimals", async () => {

      const inst = await TokenWithPermit.deployed();
      const decimals = await inst.decimals();
      assert.equal(decimals, 18);

    });

  });

  describe("Token holder", () => {

    it("has the correct token amount", async () => {

      const inst = await TokenWithPermit.deployed();
      const balance = await inst.balanceOf(accounts[1]); // note this is the second account
      assert.equal(balance, web3.utils.toWei("19000", 'ether')); // 19 thousand tokens

    });

    it("can give someone else permission to spend tokens (permit)", async () => {

      const inst = await TokenWithPermit.deployed();

      // check allowance before permit
      let allowanceBefore = await inst.allowance(accounts[1], accounts[0]);
      assert.equal(allowanceBefore, 0);

      // deadline
      let deadline = Date.now() + 2400*1000; // deadline is 40 minutes

      // tokens value
      let value = 100;
      
      // hash params: owner, spender, value, nonce, deadline, token contract address
      let params = web3.eth.abi.encodeParameters(
        [
          "address", "address", "uint256", "uint256", "uint256", "address"
        ],
        [
          accounts[1], accounts[0], value, 1, deadline, inst.address
        ]
      );

      // generate hash
      let permitHash = web3.utils.keccak256(params);

      // sig
      let sig = await web3.eth.sign(permitHash, accounts[1]);

      // extract v, r, s
      let v = web3.utils.toDecimal("0x" + sig.slice(130, 132)) + 27;
      let r = sig.slice(0, 66);
      let s = "0x" + sig.slice(66, 130);

      // call the permit() function 
      await inst.permit(accounts[1], accounts[0], value, deadline, v, r, s);
      
      // check allowance before permit
      let allowanceAfter = await inst.allowance(accounts[1], accounts[0]);
      assert.equal(allowanceAfter, 100);

    });
  });

});
