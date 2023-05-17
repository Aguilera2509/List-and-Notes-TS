import { NextPage } from "next";

export const NotDataFound:NextPage<{message:string}> = ({ message }) => {
    return(
        <div className="alert alert-danger" role="alert">
            {message}
        </div>
    );
};