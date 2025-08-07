// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FlappyDakPay {
    address payable public owner;
    uint256 public constant PRICE = 0.2 ether;
    uint8 public constant MAX_PLAYS = 3;

    mapping(address => uint8) public remainingPlays;

    constructor(address payable _owner) {
        owner = _owner;
    }

    function payToPlay() external payable {
        require(msg.value == PRICE, "Must send exactly 0.2 MON");

        (bool success, ) = owner.call{value: msg.value}("");
        require(success, "Transfer failed");

        remainingPlays[msg.sender] = MAX_PLAYS;
    }

    function usePlay() external {
        require(remainingPlays[msg.sender] > 0, "No remaining plays");
        remainingPlays[msg.sender]--;
    }

    function setOwner(address payable _newOwner) external {
        require(msg.sender == owner, "Only owner can set new owner");
        owner = _newOwner;
    }

    function getRemainingPlays(address player) external view returns (uint8) {
        return remainingPlays[player];
    }
}
