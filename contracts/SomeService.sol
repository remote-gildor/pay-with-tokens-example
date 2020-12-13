// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./IERC20Permit.sol";

contract SomeService {
  mapping (address => bool) private clients;

  function checkClient(address _client) public view returns(bool) {
    return clients[_client];
  }

  // Function that allows the service contract to spend the tx sender's tokens
  // The service contract must get the token spending approval first! (2 txs in total)
  function payWithApprovedTokens(uint amount, address tokenAddr) public {
    // Note that this function allows paying with any token, not just the BT token
    IERC20Permit token = IERC20Permit(tokenAddr);

    token.transferFrom(msg.sender, address(this), amount);

    clients[msg.sender] = true; // the user is now a client
  }

  // A function that both gives the service contract an approval to spend user's tokens, AND
  // it also transfer the tokens all in a SINGLE transaction.
  function payViaPermit(uint256 amount, address tokenAddr, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public {
    // Note that the token contract MUST have the permit() method (EIP-2612)
    IERC20Permit token = IERC20Permit(tokenAddr);

    token.permit(msg.sender, address(this), amount, deadline, v, r, s);

    token.transferFrom(msg.sender, address(this), amount);
  }
}
