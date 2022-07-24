import React, { useEffect } from "react";
import { Magic } from "magic-sdk";
import { OAuthExtension } from "@magic-ext/oauth";
import { Biconomy } from "@biconomy/mexa";
import { ethers } from "ethers";

export const SignIn = ({ setWeb3, setBiconomy }) => {
  const magic = new Magic("pk_live_C29A4926D2D9D3A5", {
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
  };

  useEffect(async () => {
    if (window.location.pathname === "") {
      await magic.oauth
        .getRedirectResult()
        .catch((error) => console.log({ error }));
      console.log("redirected found");
    } else {
      return;
    }
  }, []);

  return (
    <div>
      <div>SignIn using Google</div>
      <button onClick={connectWallet}>Sing in</button>
    </div>
  );
};
