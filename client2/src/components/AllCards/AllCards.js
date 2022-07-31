import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import styles from "./AllCards.module.css";
import { fetchCards } from "../../utils/fetcher";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AllCards = ({ contract, userAddress }) => {
  const [cards, setCards] = useState(null);
  const notify = () => {
    toast.info("Getting your Cards,hold tight! ", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const getInitialCards = async () => {
    notify();
    const res = await fetchCards(contract, userAddress);
    setCards(res);
  };

  useEffect(() => {
    getInitialCards();
  }, []);
  return (
    <div className={styles.allCardsContiner}>
      <div className={styles.heading}>Your Cards</div>

      {cards != null ? (
        cards.map((index) => {
          let dt = new Date(index.timestampValid.toNumber() * 1000);
          const date = dt.toLocaleDateString("en-us", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          return (
            <Link
              to={`/user/cards/${index.tokenId.toNumber()}`}
              style={{ textDecoration: "none" }}
              key={index.tokenId.toNumber()}
            >
              <SingleCard
                name={index.productName}
                serial={index.serialNo.toNumber()}
                validtill={date}
              />
            </Link>
          );
        })
      ) : (
        <div className={styles.loading}>Loading Your Cards....</div>
      )}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Outlet />
    </div>
  );
};

export const SingleCard = ({ name, serial, validtill }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.mainContainerCard}>
        <div className={styles.info}>
          <div className={styles.cardHeads}>{name}</div>
          <div className={styles.cardSerialNo}>Serial No: {serial}</div>
        </div>
        <div className={styles.status}>
          Valid Till
          <div className={styles.date}>{validtill}</div>
        </div>
      </div>
    </div>
  );
};
