// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BasicToken is ERC20 {
  uint bil = 1000*1000*1000;
  string _name = "Basic Token";
  string _symbol = "BT";

  constructor () ERC20(_name, _symbol) public {
    _mint(msg.sender, 10*1000*bil*bil); // mint 10 thousand tokens (note: 18 decimal places)
  }

}
