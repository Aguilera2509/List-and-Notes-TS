import { NextPage } from "next";
import { handleDelete, time } from "./helper/simplesfuncs";
import { eData, note, tip } from "./helper/interface";
import { Dispatch, SetStateAction } from "react";

export const RenderNote:NextPage<{note:note, storage:string, setEditData:Dispatch<SetStateAction<eData>>, setTip:Dispatch<SetStateAction<tip>>}> = ({ note, storage, setEditData, setTip }) => {    
    const handleUpdate = ({ target }:any):void => {
        setEditData({title:target.getAttribute("data-title"), keyword:target.getAttribute("data-keyword"), content:target.getAttribute("data-content"), 
        id:parseInt(target.getAttribute("data-id")), importance:""});
        setTip({note: true, list: false});
    };

    return(
        <div className="card text-center col-md-3 col-sm-12">
        <div className="card-header">
            {note.keyword}
        </div>
        <div className="card-body">
            <h5 className="card-title">{note.title}</h5>
            <p className="card-text">{note.content}</p>
            <div className="btn-group">
                <button type="button" className="btn btn-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    &#128394;
                </button>
                <ul className="dropdown-menu text-center">
                    <li><button type="button" onClick={handleUpdate} data-title={note.title} data-keyword={note.keyword} data-content={note.content} data-id={note.id} className="dropdown-item">Edit</button></li>
                    <li><button type="button" onClick={()=>{
                        handleDelete(note.id, storage, "notes");
                    }} className="dropdown-item">&#10060;</button></li>
                </ul>
            </div>
        </div>
        <div className="card-footer text-body-secondary">
            {time(note.id)}
        </div>
        </div>
    );
};