import { NextPage } from "next";
import Image from "next/image";

export const Loader:NextPage = () => {
    return(
        <Image width={120}  height={90} alt="Loading..." src="puff.svg" />
    )
};