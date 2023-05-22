import { ref, remove } from "firebase/database";
import { database } from "../config/firebase";

export const handleDelete = (id:number, storage:string, location:string):void =>{
    const dataToRemove:any = ref(database, `${storage.replaceAll(" ", "")}/${location}/${id}`);
    remove(dataToRemove);
};

export const time = (time:number):string =>{
    const timeHumanity:string = new Date(time).toDateString();
    return timeHumanity.toString();
};