import "./App.css";
import React, { useState, useMemo } from "react";
import { ethers } from "ethers";
import { Magic } from "magic-sdk";
import { OAuthExtension } from "@magic-ext/oauth";
import { Biconomy } from "@biconomy/mexa";
import { SignIn } from "./components/SignIn/SignIn";
import { WarrantyCard } from "./components/WarrantyCard/WarrantyCard";
import { MintToken } from "./components/MintToken.js/MintToken";
import { Login } from "./components/Login/Login";
import { UserContext } from "./utils/userContext";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import { AllCards } from "./components/AllCards/AllCards";
import { UserDashboard } from "./components/UserDashboard/UserDashboard";
import { Card } from "./components/Card/Card";
import { RetailerNavbar } from "./components/RetailerNavbar/RetailerNavbar";
import { RetailerDashboard } from "./components/RetailerDashboard/RetailerDashboard";
import { CustomerService } from "./components/CustomerService/CustomerService";

function App() {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [biconomy, setBiconomy] = useState(null);
  const [contract, setContract] = useState(null);
  const [user, setUser] = useState(null);

  const providerValue = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <Router>
      <UserContext.Provider value={providerValue}>
        <Routes>
          <Route exact path="/" element={<h1>Four oh Four</h1>}></Route>
          {/* User Routes */}
          <Route path="/user" element={<UserDashboard />}>
            <Route
              path="allcards"
              element={<AllCards contract={contract} userAddress={account} />}
            />
            <Route path="cards">
              <Route path=":id" element={<Card contract={contract} />} />
            </Route>
          </Route>
          {/* Retailer Routes */}
          <Route path="/retailer" element={<RetailerNavbar />}>
            <Route
              path="dashboard"
              element={
                <RetailerDashboard
                  contract={contract}
                  biconomy={biconomy}
                  userAddress={account}
                />
              }
            />
            <Route path="customerservice" element={<CustomerService />} />
          </Route>
          <Route
            path="/login"
            element={
              <Login
                setWeb3={setWeb3}
                setBiconomy={setBiconomy}
                setAccount={setAccount}
                setContract={setContract}
              />
            }
          />
          <Route path="*" element={<h1>Four oh Four</h1>}></Route>
        </Routes>
      </UserContext.Provider>
    </Router>
  );
}

export default App;

{
  /* <SignIn
        setWeb3={setWeb3}
        setBiconomy={setBiconomy}
        setAccount={setAccount}
        setContract={setContract}
      />
      <MintToken
        contract={contract}
        userAddress={account}
        biconomy={biconomy}
      /> */
}
