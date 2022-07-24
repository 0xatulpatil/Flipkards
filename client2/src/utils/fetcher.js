import { BigNumber } from "ethers";

export const fetchCards = async (contract, userAddress) => {
  const userBalance = await contract.balanceOf(userAddress);
  const Promisearray = [];

  // return Object.fromEntries(
  //   await Promise.all(
  //     [...Array(userBalance.toNumber())].map(async (_, index) => {
  //       const tokenIdex = await contract.tokenOfOwnerByIndex(
  //         userAddress,
  //         index
  //       );
  //       let res = await contract.getWarrantyCard(tokenIdex);
  //       return [tokenIdex.toNumber(), res];
  //     })
  //   )
  // );
  //[promises]

  return await Promise.all(
    [...Array(userBalance.toNumber())].map(async (_, index) => {
      const tokenIdex = await contract.tokenOfOwnerByIndex(userAddress, index);
      let res = await contract.getWarrantyCard(tokenIdex);
      return res;
    })
  );
};
