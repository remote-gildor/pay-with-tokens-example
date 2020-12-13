// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// ERC-20 token with permit()
contract TokenWithPermit is ERC20 {
  uint bil = 1000*1000*1000;
  string _name = "Token With Permit";
  string _symbol = "TWP";

  // permit() nonces
  mapping(address => uint) public nonces;

  constructor (address tokenHolder1, address tokenHolder2) ERC20(_name, _symbol) public {
    _mint(tokenHolder1, 19*1000*bil*bil); // mint 19 thousand tokens for the 2nd account (note: 18 decimal places)
    _mint(tokenHolder2, 1*1000*bil*bil); // mint a thousand tokens for the 1st account (note: 18 decimal places)
  }

  // Adapted from UniswapV2ERC20
  function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external {
    require(deadline >= block.timestamp, 'The request is past the deadline (EXPIRED)');

    bytes32 pHash = keccak256(
      abi.encode(owner, spender, value, nonces[owner]+1, deadline, address(this))
    );

    address recoveredAddress = ecrecover(keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", pHash)), v, r, s);
    require(recoveredAddress != address(0) && recoveredAddress == owner, 'The signature is invalid');
    _approve(owner, spender, value);
  }

}
