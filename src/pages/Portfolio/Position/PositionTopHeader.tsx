import { IMtMData, IPosition } from "@interfaces/common";
import { useAppSelector } from "@store/index";
import { positionSelector } from "@store/reducers/positionReducer";
import { useEffect, useState } from "react";
import TopHeader from "../TopHeader";
import { calculateTotalInvested, calculateTotalMtM } from "../helpers";
import MasterTopHeader from "../MasterTopHeader";
import { authSelector } from "@store/reducers/auth.reducer";
import React from "react";

const PositionTopHeader = () => {
    const userData = useAppSelector((state) => authSelector(state, "userData"));
    const [invested, setInvested] = useState(0);
    const [totalMtM, setTotalMtM] = useState(0);
    const positionList = useAppSelector((state) => positionSelector(state, 'positionList')) as IPosition[];
    const m2mData = useAppSelector((state) => positionSelector(state, 'm2mData')) as IMtMData;

    useEffect(() => {
        setTotalMtM(calculateTotalMtM(m2mData))
    }, [m2mData]);

    useEffect(() => {
        if (userData?.role?.slug !== 'master') {
            setInvested(calculateTotalInvested(positionList))
        }
    }, [positionList])

    if (userData?.role?.slug === 'master') {
        return <MasterTopHeader totalMtM={totalMtM} />
    }
    else {
        return <TopHeader totalInvested={invested} totalMtM={totalMtM} />
    }
}

export default PositionTopHeader