import React, { useState } from "react";
import styles from "./CustomerService.module.css";

export const CustomerService = ({ contract, userAddress }) => {
  const [tokenid, setTokenid] = useState();
  const [card, setCard] = useState(null);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.wrapper}>
        <div className={styles.head}>Customer Card</div>
        <div className={styles.inputs}>
          Serial No:{" "}
          <input
            type="number"
            className={styles.serial}
            value={tokenid}
            onChange={(e) => {
              setTokenid(e.target.value);
            }}
          />
          <button className={styles.btn}>Search Card</button>
        </div>
      </div>
      {card != null ? (
        <div className={styles.m}>
          <div className={styles.m}>{card.productName}</div>
          <div className={styles.m}>
            {card.replacementsAvailed + "/" + card.replacements}
          </div>
          <div className={styles.m}>
            {card.repairsAvailed + "/" + card.repairs}
          </div>
          <div className={styles.m}>
            Status:{" "}
            {card.timestampValid.toNumber() * 1000 > Date.now()
              ? "Active"
              : "Expired"}
          </div>
        </div>
      ) : (
        <div className={styles.m}>Enter serial no, to search for a card</div>
      )}
    </div>
  );
};
