import React, { useEffect, useContext } from "react";

import { Magic } from "magic-sdk";
import { OAuthExtension } from "@magic-ext/oauth";
import { Biconomy } from "@biconomy/mexa";
import { ethers } from "ethers";
import config from "../../configs";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../../utils/userContext";

export const Callback = ({ setWeb3, setAccount, setBiconomy, setContract }) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const magic = new Magic(config.magicAuthAPI, {
    extensions: [new OAuthExtension()],
  });

  let getCallbackResults = async () => {
    try {
      const isLoggedIn = await magic.user.isLoggedIn();
      console.log("Is google-authed?", isLoggedIn);

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
        biconomy
          .onEvent(biconomy.READY, resolve)
          .onEvent(biconomy.ERROR, reject)
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
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getCallbackResults();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#111614",
        color: "white",
        height: "100vh",
        fontSize: "25px",
        fontWeight: "700",
      }}
    >
      <div>Preparing the best web3 experience you'll ever have! 😉.</div>
      <div style={{ fontSize: "15px" }}>
        (Loading liraries, this may take 20-30 seconds depending on your
        internet connection...) Dont Panic, just sit back and relax..
      </div>
    </div>
  );
};
