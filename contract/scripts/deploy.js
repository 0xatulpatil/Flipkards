const hre = require("hardhat");

async function main() {
  const [address] = await ethers.getSigners();
  const ONE_MINUTE_IN_SEC = 60;
  const _repairsSet = 3;
  const _replacementSet = 1;
  const _ValiditySet = ONE_MINUTE_IN_SEC;
  const _productName = "Boat Rockerz 450G";
  let serialNo = Math.round(Math.random() * 100);

  const contractFactory = await hre.ethers.getContractFactory("FlipKards");
  const contract = await contractFactory.deploy(
    _repairsSet,
    _replacementSet,
    _ValiditySet,
    _productName,
    address.address
  );
  await contract.deployed();
  console.log("Contract deployed to address: ", contract.address);
  console.log("address minting to: ", address.address);
  const tx = await contract.mintToAddress(
    address.address,
    serialNo,
    "https://tokenURi.com"
  );
  tx.wait();
  console.log("Token Minted");

  let tx1 = await contract.getReplacements(0);
  tx1.wait();
  console.log("Replacements increased", tx1.value);

  let tx2 = await contract.availReplacements(0);
  tx2.wait();
  console.log("Replacement Increased");

  // let tx3 = await contract.availRepairs(1);
  // tx3.wait();
  // console.log(tx3);

  // let tx4 = await contract.availRepairs(1);
  // tx4.wait();
  // console.log(tx4);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
