import { IMtMData, IPosition } from '@interfaces/common';

export const calculateTotalMtM = (m2mData: IMtMData) => {
  let mtm = 0;
  if (m2mData) {
    const userIds = Object.keys(m2mData);
    for (let index = 0; index < userIds.length; index++) {
      const userId = userIds[index];
      const userSymbols = Object.keys(m2mData[userId]);
      for (let iIndex = 0; iIndex < userSymbols.length; iIndex++) {
        const userSymbol = userSymbols[iIndex];
        const userSymbolMtM = m2mData[userId][userSymbol];
        mtm = mtm + userSymbolMtM;
      }
    }
  }
  return mtm;
};

export const calculateTotalInvested = (list: IPosition[]) => {
  let tempInvested = 0;
  for (let index = 0; index < list.length; index++) {
    const element = list[index];
    if (element.netQty !== 0) {
      if (element.netQty < 0) {
        tempInvested =
          tempInvested + element.netQty * element.sellAvgPriceWithBrokerage;
      } else {
        tempInvested =
          tempInvested + element.netQty * element.buyAvgPriceWithBrokerage;
      }
    }
  }
  return tempInvested;
};
