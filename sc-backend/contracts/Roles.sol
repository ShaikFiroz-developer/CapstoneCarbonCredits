// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Roles {
    // Enum representing different roles
    enum Role {
        None,
        Supplier,
        Auditor,
        RegulatoryAuthority,
        Buyer
    }

    // User struct to store user details and role
    struct User {
        string name;
        address userAddress;
        Role role;
        bool exists;
    }

    // Mapping to store all registered users by their address
    mapping(address => User) public users;

    // Events for user sign-up and login
    event UserSignedUp(address userAddress, string name, Role role);
    event UserLoggedIn(address userAddress, Role role);

    // Modifier to ensure only registered users can call a function
    modifier onlyRegistered() {
        require(users[msg.sender].exists, "User not registered");
        _;
    }

    // Function to register a new user with a name and role
    function signup(string memory _name, uint8 _role) public {
        require(!users[msg.sender].exists, "User already registered");
        require(_role > 0 && _role <= 4, "Invalid role"); // Valid roles are from 1 to 4

        users[msg.sender] = User({
            name: _name,
            userAddress: msg.sender,
            role: Role(_role),
            exists: true
        });

        emit UserSignedUp(msg.sender, _name, Role(_role));
    }

    // Function to retrieve the details of a user
    function getUser(address userAddress) public view returns (User memory) {
        return users[userAddress];
    }

    // Function to get the role of the caller (must be registered)
    function getUserRole() public view onlyRegistered returns (Role) {
        return users[msg.sender].role;
    }
}
