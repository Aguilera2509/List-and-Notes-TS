import { NextPage } from "next";

export const NotNotifications:NextPage<{message:string}> = ({ message }) => {
    return(
        <div className="alert alert-primary alert-dismissible fade show" role="alert">
            {message}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    );
};