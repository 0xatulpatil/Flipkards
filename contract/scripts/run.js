const hre = require("hardhat");

async function main() {
  const [address] = await ethers.getSigners();
  const ONE_MINUTE_IN_SEC = 60 * 60;
  const _repairsSet = 3;
  const _replacementSet = 1;
  const _ValiditySet = ONE_MINUTE_IN_SEC;
  const _productName = "Boat Rockerz 450G";
  const _retailers = "0x02B2324065f8a6fdA4c3213E8DFDA6C9d60e7EA4";
  let serialNo = Math.round(Math.random() * 100);

  const contractFactory = await hre.ethers.getContractFactory("FlipKards");
  const contract = await contractFactory.deploy(
    _repairsSet,
    _replacementSet,
    _ValiditySet,
    _productName,
    _retailers
  );
  await contract.deployed();
  console.log("Contract deployed to address: ", contract.address);

  let tx2 = await contract.setTrustedForwarderr(
    "0x9399BB24DBB5C4b782C70c2969F58716Ebbd6a3b"
  );

  console.log("Forwarder:", tx2);

  const tx = await contract.mintToAddress(
    _retailers,
    serialNo,
    "https://tokenURi.com"
  );
  tx.wait();
  console.log("Token Minted");

  const tx3 = await contract.getWarrantyCard(0);
  console.log("card", tx2);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
