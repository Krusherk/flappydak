// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FlappyDakPay {
    address payable public owner;

    constructor(address payable _owner) {
        owner = _owner;
    }

    function playAndPay() external payable {
        require(msg.value == 1 ether, "Must send exactly 1 MON");

        (bool success, ) = owner.call{value: msg.value}("");
        require(success, "Transfer failed");
    }

    function setOwner(address payable _newOwner) external {
        require(msg.sender == owner, "Only owner can set new owner");
        owner = _newOwner;
    }
}
