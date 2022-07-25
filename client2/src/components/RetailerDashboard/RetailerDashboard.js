import React, { useState } from "react";
import styles from "./RetailerDashboard.module.css";
import config from "../../configs";

export const RetailerDashboard = ({ contract, biconomy, userAddress }) => {
  const [product, setProduct] = useState("");
  const [replacements, setReplacements] = useState("");
  const [repairs, setRepairs] = useState("");
  const [validity, setValdity] = useState("");

  const changeVariables = async () => {
    try {
      const { data } =
        await contract.populateTransaction.changeRetailerVariables(
          repairs,
          replacements,
          validity * 2630000, //converting months to seconds
          product
        );
      let provider = biconomy.getEthersProvider();

      let gasLimit = await provider.estimateGas({
        to: config.contract.address,
        from: userAddress,
        data: data,
      });
      console.log("Gas limit : ", gasLimit);
      console.log("Changing State Variables ♻");
      let txParams = {
        data: data,
        to: config.contract.address,
        from: userAddress,
        // gasLimit: gasLimit, // optional
        signatureType: "EIP712_SIGN",
      };
      let tx = await provider.send("eth_sendTransaction", [txParams]);
      console.log("Transaction hash : ", tx);

      provider.once(tx, (transaction) => {
        console.log("Variables Changed", transaction);
      });
      window.open(`https://mumbai.polygonscan.com/tx/${tx}`);
    } catch (e) {
      console.log(e);
    }
  };

  const mint = async () => {
    try {
      let serialNo = 123456;
      let { data } = await contract.populateTransaction.mintToAddress(
        userAddress,
        serialNo,
        "http://tokenuri.com"
      );
      let provider = biconomy.getEthersProvider();

      let gasLimit = await provider.estimateGas({
        to: config.contract.address,
        from: userAddress,
        data: data,
      });
      console.log("Gas limit : ", gasLimit);
      console.log("Minting your Token 💰");
      let txParams = {
        data: data,
        to: config.contract.address,
        from: userAddress,
        // gasLimit: gasLimit, // optional
        signatureType: "EIP712_SIGN",
      };
      let tx = await provider.send("eth_sendTransaction", [txParams]);
      console.log("Transaction hash : ", tx);

      provider.once(tx, (transaction) => {
        console.log("Token Minted:", transaction);
      });
      window.open(`https://mumbai.polygonscan.com/tx/${tx}`);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className={styles.mainWrapper}>
      <div className={styles.head}>Change your Product Details</div>
      <div className={styles.desc}>
        This will change how your NFT Card behaves and looks for your buyers
        hereafter. This will affect the display name of your product as well as
        waranty periods.
      </div>
      <div className={styles.inputs}>
        <div>
          Enter Your Product Name:
          <input
            className={styles.inputBox}
            type="text"
            value={product}
            onChange={(e) => {
              setProduct(e.target.value);
            }}
          />
        </div>
        <div>
          Enter new replacements Count:
          <input
            className={styles.inputBox}
            type="number"
            value={replacements}
            onChange={(e) => {
              setReplacements(e.target.value);
            }}
          />
        </div>
        <div>
          Enter new Repairs Count:
          <input
            className={styles.inputBox}
            type="number"
            value={repairs}
            onChange={(e) => {
              setRepairs(e.target.value);
            }}
          />
        </div>
        <div>
          Enter new Validity for Cards:
          <input
            className={styles.inputBox}
            type="number"
            value={validity}
            onChange={(e) => {
              setValdity(e.target.value);
            }}
          />
        </div>
      </div>
      <button
        className={styles.btn}
        onClick={() => {
          mint();
        }}
      >
        Change Features
      </button>
    </div>
  );
};
