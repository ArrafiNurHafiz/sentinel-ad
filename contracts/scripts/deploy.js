const hre = require("hardhat");

async function main() {
  console.log("=================================================");
  console.log("🚀 Deploying TacticalEvidenceRegistry to Polygon Amoy...");
  console.log("=================================================");

  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deployer Account: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Deployer Balance: ${hre.ethers.formatEther(balance)} POL`);

  const TacticalEvidenceRegistry = await hre.ethers.getContractFactory("TacticalEvidenceRegistry");
  const registry = await TacticalEvidenceRegistry.deploy();

  await registry.waitForDeployment();
  const address = await registry.getAddress();

  console.log("\n✅ TacticalEvidenceRegistry successfully deployed!");
  console.log(`Contract Address: ${address}`);
  console.log(`View on PolygonScan: https://amoy.polygonscan.com/address/${address}`);
  console.log("=================================================");
  console.log("👉 Action: Update NEXT_PUBLIC_CONTRACT_ADDRESS in .env with this address.");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
