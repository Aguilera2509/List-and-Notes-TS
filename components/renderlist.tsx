import { NextPage } from "next";
import { handleDelete, time } from "./helper/simplesfuncs";
import React, { Dispatch, SetStateAction } from "react";
import { eData, list, tip } from "./helper/interface";

export const RenderList:NextPage<{toDo:list, storage:string, setEditData:Dispatch<SetStateAction<eData>>, setTip:Dispatch<SetStateAction<tip>>}> = ({ toDo, storage, setEditData, setTip }) =>{
    const handleUpdate = (e:React.MouseEvent<HTMLButtonElement>):void =>{
        const target = e.target as HTMLElement;
        setEditData({title:target.getAttribute("data-title") || "", keyword:"", content:target.getAttribute("data-content") || "", 
        id:parseInt(target.getAttribute("data-id") || '0'), importance:target.getAttribute("data-importance") || ""});
        setTip({note: false, list: true});
    };
    
    return(
        <div className="card m-2">
        <div className="card-header">
            <strong>Level of impotance:</strong> {toDo.importance === "importanceMain" ? "Important" : toDo.importance === "importanceSecondary" ? "Medium Importance" : "Not Importance"} <br /> <strong>Created:</strong> {time(toDo.id)}
        </div>
        <div className="card-body">
            <h5 className="card-title">{toDo.title}</h5>
            <p className="card-text">{toDo.content}</p>
            <div className="btn-group">
                <button type="button" className="btn btn-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    &#128395;
                </button>
                <ul className="dropdown-menu text-center">
                    <li><button type="button" onClick={handleUpdate} data-title={toDo.title} data-content={toDo.content} data-id={toDo.id} data-importance={toDo.importance} className="dropdown-item">Edit</button></li>
                    <li><button type="button" onClick={() => {
                       handleDelete(toDo.id, storage, "list");
                    }} className="dropdown-item">&#10060;</button></li>
                </ul>
            </div>
        </div>
        </div>
    );
};