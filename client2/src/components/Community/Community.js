import React from "react";
import styles from "./Community.module.css";
export const Community = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.chat}>
        <h2>Boat Rockerz Community</h2>
        <div className={styles.user}>
          <img
            className={styles.avatar}
            alt="avatar"
            src="https://pbs.twimg.com/profile_images/1529956155937759233/Nyn1HZWF_400x400.jpg"
          ></img>
          <div className="msgwrapper">
            <div className={styles.usr}>0xatul.eth</div>
            <div className={styles.message}>
              So Excited for the launch of new Boat Rockerz
            </div>
          </div>
        </div>
        <div className={styles.user}>
          <img
            className={styles.avatar}
            alt="avatar"
            src="https://pbs.twimg.com/profile_images/1547471901467054080/u4colAfw_400x400.jpg"
          ></img>
          <div className="msgwrapper">
            <div className={styles.usr}>gmoney.eth</div>
            <div className={styles.message}>Me too, letss gooo 🤩🤩</div>
          </div>
        </div>
        <div className={styles.user}>
          <img
            className={styles.avatar}
            alt="avatar"
            src="https://pbs.twimg.com/profile_images/1440017111531855879/A4p6F07H_400x400.jpg"
          ></img>
          <div className="msgwrapper">
            <div className={styles.usr}>CryptoPunk #6529</div>
            <div className={styles.message}>
              When's the launch? I can't wait to get my hands on these new
              headphones
            </div>
          </div>
        </div>
        <div className={styles.user}>
          <img
            className={styles.avatar}
            alt="avatar"
            src="https://pbs.twimg.com/profile_images/1480461625727455234/fofDHTWQ_400x400.jpg"
          ></img>
          <div className="msgwrapper">
            <div className={styles.usr}>👑 Aman Gupta (boAt Team )</div>
            <div className={styles.message}>
              We'll be launching the new headphones on 1st of August for the
              community members ✨✨,till then stay tuned
            </div>
          </div>
        </div>
      </div>
      <div className={styles.input}>
        <input
          type="text"
          className={styles.inputbox}
          placeholder="Enter you message"
        />
        <button className={styles.btn}>Send</button>
      </div>
    </div>
  );
};
