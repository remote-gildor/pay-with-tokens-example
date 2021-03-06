const {
  BN,           // Big Number support 
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');
const { assert } = require('chai');

const BasicToken = artifacts.require("BasicToken");
const TokenWithPermit = artifacts.require("TokenWithPermit");
const SomeService = artifacts.require("SomeService");

// helper
const ether = (n) => web3.utils.toWei(n.toString(), 'ether');

contract("SomeService", accounts => {
  let basicTokenInstance;
  let tokenWithPermitInstance;
  let someServiceInstance;

  beforeEach(async () => {
    basicTokenInstance = await BasicToken.deployed();
    tokenWithPermitInstance = await TokenWithPermit.deployed();
    someServiceInstance = await SomeService.deployed();
  });

  describe("Basic Token tests", () => {

    it("approves SomeService to spend all user's 10 thousand BT tokens", async () => {

      const approval = await basicTokenInstance.approve(someServiceInstance.address, ether(10000));

      expectEvent(approval, "Approval", {
        owner: accounts[0],
        spender: someServiceInstance.address,
        value: ether(10000)
      });

    });

    it("confirms that the user has not paid for the service yet (not a client)", async () => {
      let isClient = await someServiceInstance.checkClient(accounts[0]);
      assert.isFalse(isClient);
    });

    it("user pays for the service with BT tokens", async () => {
      let serviceBalanceBefore = await basicTokenInstance.balanceOf(someServiceInstance.address);
      assert.equal(serviceBalanceBefore, 0);

      let tokenAmount = ether(100);

      let payment = await someServiceInstance.payWithApprovedTokens(tokenAmount, basicTokenInstance.address);

      // note that here we're expecting an event from another contract, hence "inTransaction"
      expectEvent.inTransaction(payment.tx, basicTokenInstance, "Transfer", {
        from: accounts[0],
        to: someServiceInstance.address,
        value: tokenAmount
      });

      let serviceBalanceAfter = await basicTokenInstance.balanceOf(someServiceInstance.address);
      assert.equal(serviceBalanceAfter, tokenAmount);
    });

    it("confirms that the user has successfully paid for the service", async () => {
      let isClient = await someServiceInstance.checkClient(accounts[0]);
      assert.isTrue(isClient);
    });

  });

  describe("TokenWithPermit tests", () => {
    it("allows service to spend tokens via permit", async () => {
      // check token balance of the service contract
      let serviceBalanceBefore = await tokenWithPermitInstance.balanceOf(someServiceInstance.address);
      assert.equal(serviceBalanceBefore, 0);

      let tokenAmount = ether(100);
      let deadline = Date.now() + 2400*1000; // deadline is 40 minutes

      // hash params: owner, spender, value, nonce, deadline, token contract address
      let params = web3.eth.abi.encodeParameters(
        [
          "address", "address", "uint256", "uint256", "uint256", "address"
        ],
        [
          accounts[0], someServiceInstance.address, tokenAmount, 1, deadline, tokenWithPermitInstance.address
        ]
      );

      // generate hash
      let permitHash = web3.utils.keccak256(params);

      // sig
      let sig = await web3.eth.sign(permitHash, accounts[0]);

      // extract v, r, s
      let v = web3.utils.toDecimal("0x" + sig.slice(130, 132)) + 27;
      let r = sig.slice(0, 66);
      let s = "0x" + sig.slice(66, 130);

      // payViaPermit()
      let payment = await someServiceInstance.payViaPermit(
        tokenAmount, 
        tokenWithPermitInstance.address,
        deadline,
        v, r, s
      );

      // note that here we're expecting an event from another contract, hence "inTransaction"
      expectEvent.inTransaction(payment.tx, tokenWithPermitInstance, "Transfer", {
        from: accounts[0],
        to: someServiceInstance.address,
        value: tokenAmount
      });

      let serviceBalanceAfter = await tokenWithPermitInstance.balanceOf(someServiceInstance.address);
      assert.equal(serviceBalanceAfter, tokenAmount);
    });
  });

});
