// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC20.sol";
import "./Roles.sol";

contract CarbonCredit is ERC20 {
    Roles private rolesContract;

    // Struct representing a carbon credit issuance request
    struct IssuanceRequest {
        address supplier;
        uint256 amount;
        string project;
        bool approved;
    }

    // Mapping to track all issuance requests by ID
    mapping(uint256 => IssuanceRequest) public issuanceRequests;
    uint256 public nextRequestId = 0;

    // Events for requesting and approving carbon credits
    event CarbonCreditRequested(
        address indexed supplier,
        uint256 requestId,
        uint256 amount,
        string project
    );
    event CarbonCreditApproved(uint256 requestId, address indexed auditor);

    // Constructor to initialize the contract with the address of the Roles contract
    constructor(
        address _rolesContractAddress
    ) ERC20("Carbon Credit Token", "CCT") {
        rolesContract = Roles(_rolesContractAddress);
    }

    // Modifier to ensure only registered suppliers can interact with the contract
    modifier onlySupplier() {
        Roles.User memory currentUser = rolesContract.getUser(msg.sender);
        require(
            currentUser.role == Roles.Role.Supplier,
            "User is not a supplier"
        );
        _;
    }

    modifier onlyAuditor() {
        Roles.User memory currentUser = rolesContract.getUser(msg.sender);
        require(
            currentUser.role == Roles.Role.Auditor,
            "User is not a supplier"
        );
        _;
    }

    // Function to request issuance of carbon credits (only for suppliers)
    function requestIssuance(
        uint256 amount,
        string memory project
    ) public onlySupplier {
        // Create a new issuance request
        issuanceRequests[nextRequestId] = IssuanceRequest({
            supplier: msg.sender,
            amount: amount,
            project: project,
            approved: false
        });

        emit CarbonCreditRequested(msg.sender, nextRequestId, amount, project);
        nextRequestId++;
    }

    // Function to approve the issuance of carbon credits (only for auditors)
    function approveIssuance(uint256 requestId) public onlyAuditor {
        IssuanceRequest storage request = issuanceRequests[requestId];
        require(!request.approved, "Issuance already approved");
        require(request.supplier != address(0), "Invalid issuance request");
        request.approved = true;
        _mint(request.supplier, request.amount);

        emit CarbonCreditApproved(requestId, msg.sender);
    }

    // Standard ERC20 transfer function
    function transfer(
        address recipient,
        uint256 amount
    ) public virtual override returns (bool) {
        return super.transfer(recipient, amount);
    }
}
