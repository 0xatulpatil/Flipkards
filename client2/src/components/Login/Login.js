import React, { useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../../utils/userContext";
import { Magic } from "magic-sdk";
import { OAuthExtension } from "@magic-ext/oauth";
import { Biconomy } from "@biconomy/mexa";
import { ethers } from "ethers";
import config from "../../configs";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Login = ({ setWeb3, setContract, setBiconomy, setAccount }) => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const notify = () => {
    toast.info("Loading Libraries.. please wait while we log you in ", {
      position: "top-center",
      autoClose: 7000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const magic = new Magic(config.magicAuthAPI, {
    extensions: [new OAuthExtension()],
  });

  const connectWallet = async () => {
    console.log("Starting auth");
    notify();

    const isLoggedIn = await magic.user.isLoggedIn();
    console.log("Is google-authed?", isLoggedIn);

    if (!isLoggedIn) {
      return magic.oauth.loginWithRedirect({
        provider: "google",
        redirectURI: window.location.origin + "/",
      });
    }

    const web3 = new ethers.providers.Web3Provider(magic.rpcProvider);
    setWeb3(web3);
    const add = await web3.getSigner().getAddress();
    console.log(add);
    setAccount(add);

    const biconomy = new Biconomy(
      new ethers.providers.JsonRpcProvider(config.contract.rpc),
      {
        apiKey: config.biconomyAPI,
        walletProvider: web3.provider,
        debug: true,
      }
    );

    await new Promise((resolve, reject) =>
      biconomy.onEvent(biconomy.READY, resolve).onEvent(biconomy.ERROR, reject)
    );
    setBiconomy(biconomy);

    let contract = new ethers.Contract(
      config.contract.address,
      config.contract.abi,
      biconomy.getSignerByAddress(add)
    );
    setContract(contract);
    setUser(magic.user.getMetadata().then((userData) => setUser(userData)));
    navigate("/user/product");
  };

  const connect = async () => {
    console.log("Starting auth");
    notify();
    const isLoggedIn = await magic.user.isLoggedIn();
    console.log("Is google-authed?", isLoggedIn);

    if (!isLoggedIn) {
      return magic.oauth.loginWithRedirect({
        provider: "google",
        redirectURI: window.location.origin + "/",
      });
    }

    const web3 = new ethers.providers.Web3Provider(magic.rpcProvider);
    setWeb3(web3);
    const add = await web3.getSigner().getAddress();
    console.log(add);
    setAccount(add);

    const biconomy = new Biconomy(
      new ethers.providers.JsonRpcProvider(config.contract.rpc),
      {
        apiKey: config.biconomyAPI,
        walletProvider: web3.provider,
        debug: true,
      }
    );

    await new Promise((resolve, reject) =>
      biconomy.onEvent(biconomy.READY, resolve).onEvent(biconomy.ERROR, reject)
    );
    setBiconomy(biconomy);

    let contract = new ethers.Contract(
      config.contract.address,
      config.contract.abi,
      biconomy.getSignerByAddress(add)
    );
    setContract(contract);
    setUser(magic.user.getMetadata().then((userData) => setUser(userData)));
    navigate("/retailer/dashboard");
  };

  useEffect(() => {
    async function init() {
      if (window.location.pathname === "/") {
        await magic.oauth.getRedirectResult().catch((error) => {
          console.log({ error });
          navigate("/");
        });
        console.log("redirected found");
      } else {
        return;
      }
    }
    init();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.user}>
        <div className={styles.head}>Login as a User</div>
        <button className={styles.btn} onClick={() => connectWallet()}>
          Login with Google
        </button>
      </div>
      <div className={styles.retailer}>
        <div className={styles.head}>Login as Retailer</div>
        <button
          className={styles.btn}
          onClick={() => {
            connect();
          }}
        >
          Login with Google
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
