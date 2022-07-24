import React, { useState, useEffect } from "react";
import config from "../../configs";

export const MintToken = ({ contract, userAddress, biconomy }) => {
  const mint = async () => {
    try {
      let serialNo = 11;
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

      //   biconomy.on("txMined", () => {
      //     console.log("txn mined");
      //   });
      //   biconomy.on("onError", () => {
      //     console.log("Some error happended");
      //   });
      provider.once(tx, (transaction) => {
        console.log("Token Minted:", transaction);
      });
      window.open(`https://mumbai.polygonscan.com/tx/${tx}`);
    } catch (err) {
      console.log(err);
    }
  };

  const changeVariables = async () => {
    try {
      let { data } = await contract.populateTransaction.changeRetailerVariables(
        4,
        3,
        12000,
        "lorem ipsum"
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
        console.log("Variables Changed", transaction);
      });
      window.open(`https://mumbai.polygonscan.com/tx/${tx}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          mint();
        }}
      >
        Mint Token for you
      </button>

      <button
        onClick={() => {
          changeVariables();
        }}
      >
        Change Variables
      </button>
    </div>
  );
};
