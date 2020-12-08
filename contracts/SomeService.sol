// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SomeService {
  mapping (address => bool) private clients;

  function checkClient(address _client) public view returns(bool) {
    return clients[_client];
  }

  function payWithApprovedTokens(uint amount, address tokenAddr) public {
    // Note that this function allows paying with any token, not just the BT token
    IERC20 token = IERC20(tokenAddr);

    token.transferFrom(msg.sender, address(this), amount);

    clients[msg.sender] = true; // the user is now a client
  }


  // function payViaPermit
}
