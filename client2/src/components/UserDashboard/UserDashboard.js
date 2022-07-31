import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import styles from "./UserDashboard.module.css";

export const UserDashboard = ({
  logout,
  setContract,
  setWeb3,
  setAccount,
  setBiconomy,
  setUser,
}) => {
  const navigate = useNavigate();
  return (
    <div>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Link
            to="/user/allcards"
            style={{ textDecoration: "none", all: "none", color: "#E46138" }}
          >
            Flipkards
          </Link>
        </div>

        <div className={styles.option}>
          <div className={styles.shop}>
            <Link
              style={{ textDecoration: "none", color: "white" }}
              to="/user/product"
            >
              Shop
            </Link>
          </div>
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
            className={styles.logoutBtn}
          >
            Logout
          </button>
        </div>
      </nav>
      <Outlet />
    </div>
  );
};
