import "./App.css";
import React, { useState } from "react";
import { ethers } from "ethers";
import { Magic } from "magic-sdk";
import { OAuthExtension } from "@magic-ext/oauth";
import { Biconomy } from "@biconomy/mexa";
import { SignIn } from "./components/SignIn/SignIn";

function App() {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [biconomy, setBiconomy] = useState(null);

  return (
    <div>
      <SignIn setWeb3={setWeb3} setBiconomy={setBiconomy} />
    </div>
  );
}

export default App;
