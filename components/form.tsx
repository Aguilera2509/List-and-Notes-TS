import { NextPage } from "next"
import React, { Dispatch, SetStateAction } from "react"
import { eData, list, note, tip } from "./helper/interface"
import { ref, set, update } from "firebase/database";
import { database } from "./config/firebase";

function writeUserData(body: { title: string, keyword: string, content: string, importance:string, id:number }, storage:string):void {
  if(body.keyword){
    set(ref(database, `${JSON.parse(storage)}/notes/${body.id}`), {
      title: body.title,
      keyword: body.keyword,
      content: body.content,
      id: body.id
    });
  }else{
    set(ref(database, `${JSON.parse(storage)}/list/${body.id}`), {
      title: body.title,
      content: body.content,
      importance: body.importance,        
      id: body.id
    });
  };
};

function writeNewPost(body: { title:string, keyword:string, content:string, importance:string, id:number }, storage:string):void {
  if(body.keyword){
    const postData:note = {
      title: body.title,
      keyword: body.keyword,
      content: body.content,
      id: body.id
    };
    // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates:any = {};
    updates[`${JSON.parse(storage)}/notes/${body.id}`] = postData;
    update(ref(database), updates);
  }else{
    const postData:list = {
      title: body.title,
      content: body.content,
      importance: body.importance,
      id: body.id
    };
    // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates:any = {};
    updates[`${JSON.parse(storage)}/list/${body.id}`] = postData;
    update(ref(database), updates);
  };  
};

export const Form:NextPage<{tip:tip, storage:string, setTip:Dispatch<SetStateAction<tip>>, 
  editData:eData, setEditData:Dispatch<SetStateAction<eData>>}> = ({tip, storage, setTip, editData, setEditData}) =>{

  const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>):void =>{
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleCancel = ():void => {
    setTip({note: false, list: false});
    setEditData({title:"", keyword:"", content:"", id:0, importance:""});
  };

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>):void => {
    e.preventDefault();

    if(editData.id){
      writeNewPost(editData, storage);
      handleCancel();
      return
    };

    editData.id = Date.now();
    writeUserData(editData, storage);
    handleCancel();
  };

  return (
    <form onSubmit={handleSubmit} className={tip.note ? 
    "panel is-active container" : 
    tip.list ? "panel is-active container" : "panel container"}>
      <div className="p-4 mb-2 bg-secondary-subtle rounded-4">
        <div className="form-floating mb-3 shadow-sm">
          <input type="text" name="title" value={editData.title} onChange={handleChange} className="form-control" id="floatingTitle" placeholder="Cook's recipe" />
          <label htmlFor="floatingTitle">Title</label>
        </div>
        {tip.note &&
          <div className="form-floating mb-3 shadow-sm">
            <input type="text" name="keyword" value={editData.keyword} onChange={handleChange} className="form-control" id="floatingKeyword" placeholder="Kitchen" />
            <label htmlFor="floatingKeyword">Keyword</label>
          </div>
        }
        <div className="form-floating mb-3 shadow-sm">
          <textarea className="form-control" value={editData.content} onChange={handleChange} name="content" placeholder="Leave a comment here" id="floatingTextarea2" style={{"height": "100px", "resize": "none"}}></textarea>
          <label htmlFor="floatingTextarea2">About</label>
        </div>
        {tip.list &&
          <div className="mb-3">
            <div className="form-check">
              <input className="form-check-input" type="radio" name="importance" id="exampleRadios1" value="importanceMain" onChange={handleChange} checked={editData.importance === "importanceMain"} />
              <label className="form-check-label" htmlFor="exampleRadios1">
                Important
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="importance" id="exampleRadios2" value="importanceSecondary" onChange={handleChange} checked={editData.importance === "importanceSecondary"} />
              <label className="form-check-label" htmlFor="exampleRadios2">
                Medium Important
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="importance" id="exampleRadios3" value="notImportance" onChange={handleChange} checked={editData.importance === "notImportance"} />
              <label className="form-check-label" htmlFor="exampleRadios3">
                Not Important
              </label>
            </div>
          </div>  
        }

        <p>Do not forget when you just wake up you have a plenty day but if you use wisely it your time you only have an opportunity</p>

        <div className="modal-footer">
          <button type="button" onClick={handleCancel} className="btn btn-danger me-2">Cancel</button>
          <button type="submit" className="btn btn-success">Submit</button>
        </div>
      </div>
    </form>
  )
}