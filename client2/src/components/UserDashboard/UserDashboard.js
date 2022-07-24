import React from "react";
import { Outlet, Link } from "react-router-dom";
import styles from "./UserDashboard.module.css";

export const UserDashboard = () => {
  return (
    <div>
      <nav className={styles.nav}>
        <div className={styles.logo}>Flipkards</div>
        <div className={styles.option}>
          <button className={styles.logoutBtn}>Logout</button>
        </div>
      </nav>
      <Outlet />
    </div>
  );
};
