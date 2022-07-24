import React, { useEffect } from "react";
import { Magic } from "magic-sdk";
import { OAuthExtension } from "@magic-ext/oauth";
import { Biconomy } from "@biconomy/mexa";
import { ethers } from "ethers";
import config from "../../configs";

export const SignIn = ({ setWeb3, setBiconomy, setAccount, setContract }) => {
  const magic = new Magic(config.magicAuthAPI, {
    extensions: [new OAuthExtension()],
  });

  const connectWallet = async () => {
    console.log("Starting auth");
    const isLoggedIn = await magic.user.isLoggedIn();
    console.log("Is google-authed?", isLoggedIn);

    if (!isLoggedIn) {
      return magic.oauth.loginWithRedirect({
        provider: "google",
        redirectURI: window.location.origin + "",
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
  };

  const logout = async () => {
    try {
      magic.user.logout();
      let loggedIn = await magic.user.isLoggedIn();
      console.log("User Logged in?:", loggedIn);
      setAccount(null);
      setBiconomy(null);
      setWeb3(null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    async function init() {
      if (window.location.pathname === "") {
        await magic.oauth
          .getRedirectResult()
          .catch((error) => console.log({ error }));
        console.log("redirected found");
      } else {
        return;
      }
    }
    init();
  }, []);

  return (
    <div>
      <div>SignIn using Google</div>
      <button onClick={connectWallet}>Sing in</button>
      <button onClick={logout}>Log Out</button>
    </div>
  );
};
