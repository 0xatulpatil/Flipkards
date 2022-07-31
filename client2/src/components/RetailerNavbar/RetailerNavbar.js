import React, { useState, useEffect } from "react";
import styles from "./RetailerNavbar.module.css";
import { Link, Outlet, useNavigate } from "react-router-dom";

export const RetailerNavbar = ({
  logout,
  setContract,
  setWeb3,
  setAccount,
  setBiconomy,
  setUser,
}) => {
  const navigate = useNavigate();
  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Link
            to="/retailer/dashboard"
            style={{ textDecoration: "none", color: "#E46138" }}
          >
            Flipkards
          </Link>
        </div>
        <div className={styles.elems}>
          <div className={styles.m}>
            <Link
              to="/retailer/dashboard"
              style={{ textDecoration: "none", color: "white" }}
            >
              Dashboard
            </Link>
          </div>

          <Link
            to="/retailer/customerservice"
            style={{ textDecoration: "none", color: "white" }}
          >
            <div className={styles.m}>Customer - Service</div>
          </Link>
          {/* <Link to="">
            <div className={styles.m}></div>
          </Link> */}
          <button
            onClick={() => {
              logout();
              setWeb3(null);
              setContract(null);
              setAccount(null);
              setBiconomy(null);
              setUser(null);
              navigate("/");
            }}
            className={styles.logout}
          >
            Log Out
          </button>
        </div>
      </nav>
      <Outlet />
    </>
  );
};
