import React, { useState } from "react";
import styles from "./RetailerDashboard.module.css";
import config from "../../configs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const RetailerDashboard = ({ contract, biconomy, userAddress }) => {
  const [product, setProduct] = useState("");
  const [replacements, setReplacements] = useState("");
  const [repairs, setRepairs] = useState("");
  const [validity, setValdity] = useState("");
  const [retailerAddress, setRetailerAddress] = useState("");

  const notify = () => {
    toast.info("Sending your transactions to the blockchain...", {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const success = () => {
    toast.info("Transaction Complete", {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const changeVariables = async () => {
    try {
      notify();
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
        success();
      });
      console.log(`https://mumbai.polygonscan.com/tx/${tx}`);
    } catch (e) {
      console.log(e);
    }
  };

  const addRetailer = async () => {
    try {
      const { data } = await contract.populateTransaction.addRetailer(
        retailerAddress
      );
      let provider = biconomy.getEthersProvider();
      notify();
      let gasLimit = await provider.estimateGas({
        to: config.contract.address,
        from: userAddress,
        data: data,
      });
      console.log("Gas limit : ", gasLimit);
      console.log("Adding Retailer♻");
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
        console.log("Retailer Added", transaction);
        success();
      });
      console.log(`https://mumbai.polygonscan.com/tx/${tx}`);
    } catch (e) {
      console.log(e);
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
          ( in months )
        </div>
      </div>
      <button
        className={styles.btn}
        onClick={() => {
          changeVariables();
        }}
      >
        Change Features
      </button>
      <div className={styles.addretailer}>
        <div className={styles.heading}>Add retailer to your Brand</div>
        <input
          type="text"
          className={styles.retailerAddress}
          value={retailerAddress}
          onChange={(e) => {
            setRetailerAddress(e.target.value);
          }}
        />

        <button
          onClick={() => {
            addRetailer();
          }}
          className={styles.addRetailerbtn}
        >
          Add Retailer
        </button>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};
