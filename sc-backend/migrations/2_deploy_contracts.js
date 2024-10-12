const Roles = artifacts.require("Roles");
const CarbonCredit = artifacts.require("CarbonCredit");

module.exports = async function (deployer) {
  // Deploy the Roles contract
  await deployer.deploy(Roles);
  const rolesInstance = await Roles.deployed();

  // Deploy the CarbonCredit contract with the address of the Roles contract
  await deployer.deploy(CarbonCredit, rolesInstance.address);
};
