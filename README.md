# Pay With Tokens example

> In heavy development

A smart contract and a Vue dApp that allows user to pay for a service with tokens.

Two ways to pay with tokens:

- Approve + Transfer (**two** transactions)
- using `permit()` in order to do both the approval and the transfer **in 1 transaction**

## TODO

- Vue dApp

## Install npm packages

Run `npm install` command in both root folder and the `vapp` folder.

## Ganache

Make sure Ganache is running on port **7545**.

## Tests

### Solidity tests

```bash
truffle test
```
