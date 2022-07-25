import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./Card.module.css";
import QRCode from "react-qr-code";
import config from "../../configs";

export const Card = ({ contract }) => {
  let params = useParams();
  const [cardData, setCardData] = useState(null);
  const [ownerAddress, setOwnerAddress] = useState("0x00");

  const getCard = async () => {
    let data = await contract.getWarrantyCard(params.id);
    console.log(data);
    setCardData(data);
  };

  const owner = async () => {
    try {
      let owner = await contract.ownerOf(cardData.tokenId.toNumber());
      setOwnerAddress(owner);
    } catch (err) {
      console.log(err);
    }
  };

  const timestampToDate = (ts) => {
    let dt = new Date(ts * 1000);
    const date = dt.toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return date;
  };

  useEffect(() => {
    getCard();
    owner();
  }, []);

  return (
    <>
      {cardData === null ? (
        <></>
      ) : (
        <div className={styles.bg}>
          <div className={styles.mainContainer}>
            <div className={styles.Card}>
              <div className={styles.cardInfo}>
                <div className={styles.mainCard}>
                  <div className={styles.description}>
                    <div>
                      <div className={styles.productName}>
                        {cardData.productName}
                      </div>
                      <div className={styles.serialNo}>
                        Serial No: {cardData.serialNo.toNumber()}
                      </div>
                    </div>
                    {/* <div className={styles.owner}>0x5sdfsf.....3345345</div> */}
                  </div>
                  <div className={styles.qrCode}>
                    <QRCode
                      value={`https://mumbai.polygonscan.com/token/${config.contract.address}`}
                      size={120}
                      fgColor={"#0a0a0a"}
                      bgColor={"#E0E0E0"}
                    />
                  </div>
                </div>

                <div className={styles.subCard}>
                  <div className={styles.purchasedon}>
                    Issued on{" "}
                    <div className={styles.date}>
                      {timestampToDate(cardData.timestampBought.toNumber())}
                    </div>
                  </div>
                  <div className={styles.validtill}>
                    Valid Till{" "}
                    <div className={styles.date}>
                      {timestampToDate(cardData.timestampValid.toNumber())}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.subContainer}>
            <div className={styles.perks}>
              <div className={styles.perksHead}>Perks</div>
              <div className={styles.perksDiv}>
                <div className={styles.perks1}>
                  <div className="perksIcon">
                    <div className={styles.icon}></div>
                    <div className={styles.perksText}>Replacements Availed</div>
                  </div>
                  <div className={styles.perksCount}>
                    {cardData.replacementsAvailed.toNumber() +
                      "/" +
                      cardData.replacements.toNumber()}
                  </div>
                </div>
                <div className={styles.perks1}>
                  <div className="perksIcon">
                    <div className={styles.icon}></div>
                    <div className={styles.perksText}>Repairs Availed</div>
                  </div>
                  <div className={styles.perksCount}>
                    {cardData.repairsAvailed.toNumber() +
                      "/" +
                      cardData.repairs.toNumber()}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.ownerInfo}>
              <h2 className={styles.ownerHead}>Owner</h2>
              <div className={styles.address}>{ownerAddress}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
