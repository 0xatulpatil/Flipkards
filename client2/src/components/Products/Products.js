import React from "react";
import styles from "./Products.module.css";
import productlist from "../../utils/productlist";
import { ConstructorFragment } from "ethers/lib/utils";
import { Navigate, useNavigate } from "react-router";
import config from "../../configs";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Products = ({ userAddress, contract, biconomy }) => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.head}>Shop now</h2>
      <div className={styles.products}>
        {productlist.map((index) => {
          return (
            <Card
              props={index}
              key={index.imageURL}
              userAddress={userAddress}
              contract={contract}
              biconomy={biconomy}
            />
          );
        })}
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
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

export const Card = ({ props, userAddress, contract, biconomy }) => {
  const navigate = useNavigate();
  const notify = () =>
    toast.info("Minting in Progress, will take 1-2 minutes", {
      position: "top-center",
      autoClose: 7000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const mintToken = async () => {
    try {
      let serialNo = props.serialNo;
      let { data } = await contract.populateTransaction.mintToAddress(
        userAddress,
        serialNo,
        props.tokenURI
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
      console.log(`https://mumbai.polygonscan.com/tx/${tx}`);
    } catch (err) {
      console.log(err);
    }
    navigate("/user/allcards");
  };
  return (
    <div className={styles.cardwrapper}>
      <div className={styles.image}>
        <img
          className={styles.img}
          src={props.imageURL}
          alt="boat Headphones"
        />
      </div>
      <div className={styles.info}>
        <div className={styles.name}>{props.name}</div>
        <div className={styles.otherinfo}>
          <div className={styles.price}>Price: Rs. {props.price}</div>
          <div className={styles.warranty}>
            Warranty: {props.warranty} Months
          </div>
        </div>
        <button
          className={styles.buy}
          onClick={() => {
            notify();
            mintToken();
          }}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};
