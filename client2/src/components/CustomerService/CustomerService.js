import React, { useState } from "react";
import styles from "./CustomerService.module.css";
import config from "../../configs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const CustomerService = ({ contract, userAddress, biconomy }) => {
  const [tokenid, setTokenid] = useState("");
  const [card, setCard] = useState(null);

  const notify = () => {
    toast.info("Sending your transactions to the blockchain...", {
      position: "top-center",
      autoClose: 3000,
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
  const error = () => {
    toast.error("Some error happened", {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const searchCard = async () => {
    if (tokenid === "") {
      alert("Please enter a tokenId to search for");
      return;
    }
    try {
      const res = await contract.getWarrantyCard(tokenid);
      console.log(res);
      setCard(res);
    } catch (e) {
      console.log(e);
    }
  };

  const replaceItem = async () => {
    try {
      notify();
      let { data } = await contract.populateTransaction.availReplacements(
        card.tokenId.toNumber()
      );
      let provider = biconomy.getEthersProvider();

      let gasLimit = await provider.estimateGas({
        to: config.contract.address,
        from: userAddress,
        data: data,
      });
      console.log("Gas limit : ", gasLimit);
      console.log("Availing Replacement 💰");
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
        console.log("Replacement Availed", transaction);
        success();
      });
    } catch (err) {
      error();
      console.log(err);
    }
  };

  const repairItem = async () => {
    try {
      notify();

      let { data } = await contract.populateTransaction.availRepairs(
        card.tokenId.toNumber()
      );
      let provider = biconomy.getEthersProvider();

      let gasLimit = await provider.estimateGas({
        to: config.contract.address,
        from: userAddress,
        data: data,
      });
      console.log("Gas limit : ", gasLimit);
      console.log("Availing Replacement 💰");
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
        console.log("Replacement Availed", transaction);
        success();
        searchCard();
      });
    } catch (err) {
      error();
      console.log(err);
    }
  };
  return (
    <div className={styles.mainContainer}>
      <div className={styles.wrapper}>
        <div className={styles.head}>Customer Card</div>
        <div className={styles.inputs}>
          Serial No:{" "}
          <input
            type="number"
            className={styles.serial}
            value={tokenid}
            onChange={(e) => {
              setTokenid(e.target.value);
            }}
          />
          <button
            onClick={() => {
              searchCard();
            }}
            className={styles.btn}
          >
            Search Card
          </button>
        </div>
      </div>
      {card != null ? (
        <div className={styles.ma}>
          <div className={styles.m}>
            <span className={styles.spans}>Product Name:</span>{" "}
            {card.productName}
          </div>
          <div className={styles.m}>
            <span className={styles.spans}>Replacements Availed</span>
            {card.replacementsAvailed + "/" + card.replacements}
          </div>
          <div className={styles.m}>
            <span className={styles.spans}>Repairs Availed:</span>
            {card.repairsAvailed + "/" + card.repairs}
          </div>
          <div className={styles.m}>
            <span className={styles.spans}>Owner:</span>
            {card.ownerAddress}
          </div>
          <div className={styles.m}>
            <span className={styles.spans}>Status:</span>
            {card.timestampValid.toNumber() * 1000 > Date.now()
              ? "Active"
              : "Expired"}
          </div>
        </div>
      ) : (
        <div className={styles.m}></div>
      )}

      <div classNames={styles.btns}>
        <button
          onClick={() => {
            repairItem();
          }}
          className={styles.btn1}
        >
          Repair Item
        </button>
        <button
          onClick={() => {
            replaceItem();
          }}
          className={styles.btn1}
        >
          Replace Item
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
