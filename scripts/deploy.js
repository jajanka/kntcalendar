const hre = require("hardhat");

async function main() {
  console.log("Deploying EntryUnlock contract...");

  const EntryUnlock = await hre.ethers.getContractFactory("EntryUnlock");
  const entryUnlock = await EntryUnlock.deploy();

  await entryUnlock.waitForDeployment();

  const address = await entryUnlock.getAddress();
  console.log("EntryUnlock deployed to:", address);

  // Verify the deployment
  console.log("Verifying contract...");
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [],
    });
    console.log("Contract verified on block explorer");
  } catch (error) {
    console.log("Verification failed:", error.message);
  }

  console.log("\nDeployment Summary:");
  console.log("===================");
  console.log("Contract Address:", address);
  console.log("Network:", hre.network.name);
  console.log("Unlock Price: 0.001 MONAD");
  console.log("\nNext steps:");
  console.log("1. Update NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local");
  console.log("2. Update the contract ABI in app/hooks/useEntryUnlock.js");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 