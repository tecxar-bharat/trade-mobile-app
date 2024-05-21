import { IMtMData, IPosition } from "@interfaces/common";
import { useAppSelector } from "@store/index";
import { authSelector } from "@store/reducers/auth.reducer";
import { holdingSelector } from "@store/reducers/holdingReducer";
import { useEffect, useState } from "react";
import MasterTopHeader from "../MasterTopHeader";
import TopHeader from "../TopHeader";
import { calculateTotalInvested, calculateTotalMtM } from "../helpers";

const HoldingTopHeader = () => {
    const userData = useAppSelector((state) => authSelector(state, "userData"));
    const [invested, setInvested] = useState(0);
    const [totalMtM, setTotalMtM] = useState(0);
    const holdingList = useAppSelector((state) => holdingSelector(state, 'holdingList')) as IPosition[];
    const m2mData = useAppSelector((state) => holdingSelector(state, 'm2mData')) as IMtMData;

    useEffect(() => {
        setTotalMtM(calculateTotalMtM(m2mData))
    }, [m2mData]);

    useEffect(() => {
        if (userData?.role?.slug !== 'master') {
            setInvested(calculateTotalInvested(holdingList))
        }
    }, [holdingList])

    if (userData?.role?.slug === 'master') {
        return <MasterTopHeader totalMtM={totalMtM} />
    }
    else {
        return <TopHeader totalInvested={invested} totalMtM={totalMtM} />
    }
}

export default HoldingTopHeader