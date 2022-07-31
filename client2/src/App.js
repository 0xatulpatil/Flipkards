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

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import { Products } from "./components/Products/Products";
import config from "./configs";
import { Community } from "./components/Community/Community";
import { Callback } from "./components/Callback/Callback";
import { CallbackRetailer } from "./components/CallbackRetailer/CallbackRetailer";

function App() {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [biconomy, setBiconomy] = useState(null);
  const [contract, setContract] = useState(null);
  const [user, setUser] = useState(null);

  const magic = new Magic(config.magicAuthAPI);

  const logout = async () => {
    let magic = new Magic(config.magicAuthAPI);
    try {
      console.log("Logging out");
      await magic.user.logout();
      console.log(await magic.user.isLoggedIn());
    } catch (e) {
      console.log(e);
    }
  };

  const providerValue = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <Router>
      <UserContext.Provider value={providerValue}>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <Login
                setWeb3={setWeb3}
                setBiconomy={setBiconomy}
                setAccount={setAccount}
                setContract={setContract}
              />
            }
          ></Route>
          <Route
            path="/callback"
            element={
              <Callback
                setWeb3={setWeb3}
                setBiconomy={setBiconomy}
                setAccount={setAccount}
                setContract={setContract}
              />
            }
          />
          <Route
            path="/callbackretailer"
            element={
              <CallbackRetailer
                setWeb3={setWeb3}
                setBiconomy={setBiconomy}
                setAccount={setAccount}
                setContract={setContract}
              />
            }
          />
          {/* User Routes */}
          <Route
            path="/user"
            element={
              <UserDashboard
                logout={logout}
                setWeb3={setWeb3}
                setAccount={setAccount}
                setContract={setContract}
                setBiconomy={setBiconomy}
                setUser={setUser}
              />
            }
          >
            <Route
              path="allcards"
              element={<AllCards contract={contract} userAddress={account} />}
            />
            <Route path="cards">
              <Route path=":id" element={<Card contract={contract} />} />
            </Route>
            <Route
              path="product"
              element={
                <Products
                  contract={contract}
                  biconomy={biconomy}
                  userAddress={account}
                />
              }
            />
            <Route path="community" element={<Community />} />
          </Route>

          {/* Retailer Routes */}
          <Route
            path="/retailer"
            element={
              <RetailerNavbar
                logout={logout}
                setWeb3={setWeb3}
                setAccount={setAccount}
                setContract={setContract}
                setBiconomy={setBiconomy}
                setUser={setUser}
              />
            }
          >
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
            <Route
              path="customerservice"
              element={
                <CustomerService
                  contract={contract}
                  userAddress={account}
                  biconomy={biconomy}
                />
              }
            />
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
      </UserContext.Provider>{" "}
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
