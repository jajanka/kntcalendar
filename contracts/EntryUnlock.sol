// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EntryUnlock {
    struct Payment {
        address payer;
        address entryOwner;
        string entryId;
        uint256 amount;
        uint256 timestamp;
        bool verified;
    }

    mapping(bytes32 => Payment) public payments;
    mapping(address => mapping(string => bool)) public unlockedEntries;
    
    uint256 public unlockPrice = 0.001 ether; // 0.001 MONAD
    address public owner;
    
    event EntryUnlocked(
        address indexed payer,
        address indexed entryOwner,
        string entryId,
        uint256 amount,
        uint256 timestamp
    );
    
    event PriceUpdated(uint256 newPrice);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    function unlockEntry(address entryOwner, string memory entryId) external payable {
        require(msg.value >= unlockPrice, "Insufficient payment amount");
        require(!unlockedEntries[entryOwner][entryId], "Entry already unlocked");
        
        bytes32 paymentId = keccak256(abi.encodePacked(entryOwner, entryId, msg.sender));
        
        payments[paymentId] = Payment({
            payer: msg.sender,
            entryOwner: entryOwner,
            entryId: entryId,
            amount: msg.value,
            timestamp: block.timestamp,
            verified: true
        });
        
        unlockedEntries[entryOwner][entryId] = true;
        
        emit EntryUnlocked(msg.sender, entryOwner, entryId, msg.value, block.timestamp);
    }
    
    function isEntryUnlocked(address entryOwner, string memory entryId) external view returns (bool) {
        return unlockedEntries[entryOwner][entryId];
    }
    
    function getPaymentInfo(address entryOwner, string memory entryId, address payer) external view returns (Payment memory) {
        bytes32 paymentId = keccak256(abi.encodePacked(entryOwner, entryId, payer));
        return payments[paymentId];
    }
    
    function setUnlockPrice(uint256 newPrice) external onlyOwner {
        unlockPrice = newPrice;
        emit PriceUpdated(newPrice);
    }
    
    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
} 