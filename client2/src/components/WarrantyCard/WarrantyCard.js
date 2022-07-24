import React, { useEffect, useState } from "react";
import { fetchCards } from "../../utils/fetcher";

export const WarrantyCard = ({ id, contract, userAddress }) => {
  const [card, setCard] = useState(null);
  const getCardbyId = async (id) => {
    // if (contract != null) {
    //   try {
    //     const res = await contract.getWarrantyCard(id);
    //     console.log(res.tokenId);
    //     // setCard(res);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // } else {
    //   console.log("contract NULL");
    // }
    const res = await fetchCards(contract, userAddress);
    console.log(res);
  };

  useEffect(() => {
    getCardbyId(0);
  }, [contract, userAddress]);

  return (
    <div>
      <div>WarrantyCard</div>
    </div>
  );
};
