import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { v4 } from 'uuid';
import React, { useEffect, useState } from 'react';
import { RenderNote } from '../components/rendernotes';
import { RenderList } from '../components/renderlist';
import { Form } from '../components/form';
import { DatabaseReference, onValue, ref } from 'firebase/database';
import { database } from '../components/config/firebase';
import Script from 'next/script';
import { eData, list, tip, uData } from '../components/helper/interface';
import { Loader } from '../components/loader';
import { NotDataFound } from '../components/notdata';
import { NotNotifications } from '../components/notgrantednotification';

const deleteMove:string[] = ["Meta", "F2", "F4", "F8", "F9", "F11", "F10", "F12", "ScrollLock", "Pause", "PageDown", "Insert", "Home", "PageUp", "Delete", "End", "NumLock", "Control", "Alt", "Enter", "Shift", "CapsLock", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Escape"];

const Home: NextPage = ( ) => {
  const [storage, setStorage] = useState<string>("");
  const [yourData, setYourData] = useState<uData>({
    list: [],
    notes: []
  });
  const [tip, setTip] = useState<tip>({
    note:false,
    list:false
  });
  const [editData, setEditData] = useState<eData>({
    title:"",
    keyword:"",
    content:"",
    id: 0,
    importance:""
  });
  const [loader, setLoader] = useState<boolean>(true);
  const [notificationAllowed, setNotificationAllowed] = useState<boolean>(false);
  const [errorSW, setErrorSW] = useState<boolean>(false);
  const [filNotes, setFilNotes] = useState<Array<string>>([]);
  const [filList, setFilList] = useState<Array<string>>([]);

  const getDataFirebase = ():void =>{
    const starCountRef:DatabaseReference = ref(database, JSON.parse(storage));
    onValue(starCountRef, (snapshot:any) => {
      const data:uData = snapshot.val();
      if(data === null) {
        setYourData({list: [], notes: []});
        setLoader(false);
        return; 
      };

      const first:list[] = data.list ? Object.values(data.list).filter(el => el.importance === "importanceMain") : [];
      const second:list[] =  data.list ? Object.values(data.list).filter(el => el.importance === "importanceSecondary") : [];
      const third:list[] = data.list ? Object.values(data.list).filter(el => el.importance === "notImportance") : [];
    
      setYourData({list: [...first, ...second, ...third], notes: data.notes === undefined ? [] : data.notes});
      setLoader(false);
      if(data.list === null && notificationAllowed){
        navigator.serviceWorker.ready.then((registration) => {
          registration.active!.postMessage(data.list);
        });
      };
    });
  };

  const registerServiceWorker = async ():Promise<void> => {
    const result:NotificationPermission = await Notification.requestPermission();
    if (result === 'granted') {
      setNotificationAllowed(true);
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
          });
          if (registration.installing) {
            console.log("Service worker installing");
          } else if (registration.waiting) {
            console.log("Service worker installed");
          } else if (registration.active) {
            console.log("Service worker active");
          };
        } catch (error) {
          setErrorSW(true);
        };
      };
    }else{
      setNotificationAllowed(false);
    };
  };
  
  const handleKeyUpNote = (event:React.KeyboardEvent<HTMLInputElement>):void => {
    if(yourData.notes.length === 0) return;
    if(deleteMove.includes(event.key)) return setFilNotes(filNotes);
    if(event.key === "Backspace"){
      const copy:string[] = [...filNotes];
      copy.pop();
      setFilNotes(copy);
      return
    };
    setFilNotes([...filNotes, event.key.toLowerCase()]);
  };

  const handleKeyUpList = (event:React.KeyboardEvent<HTMLInputElement>):void => {
    if(yourData.list.length === 0) return;
    if(deleteMove.includes(event.key)) return setFilList(filList);
    if(event.key === "Backspace"){
      const copy:string[] = [...filList];
      copy.pop();
      setFilList(copy);
      return
    };
    setFilList([...filList, event.key.toLowerCase()]);
  };

  useEffect(()=>{
    registerServiceWorker()

    const myStorage:Storage = localStorage;
    
    if(storage.length !== 0 && myStorage.getItem("storage") !== null){
      getDataFirebase();
      return;
    };
    
    if(myStorage.getItem("storage") !== null) return setStorage(JSON.stringify(myStorage.getItem("storage")));

    if(storage === ""){
      setStorage(v4());
    }else{
      myStorage.setItem("storage", storage);
    };
  },[storage]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Notes&ListToDo</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossOrigin="anonymous"></link>
      </Head>
  
      <Form tip={tip} storage={storage} setTip={setTip} editData={editData} setEditData={setEditData} />

      <div className="card m-3 text-bg-warning h4">
        <div className="d-flex justify-content-between">
            <div className="p-3">
              Your Notes
            </div>
            <div className="p-3">
              <input type="text" className="form-control" placeholder="Keyword" onKeyUp={handleKeyUpNote} />
            </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          {Object.keys(yourData.notes).length === 0 && loader &&
            <Loader />
          }
          {Object.keys(yourData.notes).length === 0 && !loader &&
            <NotDataFound message="Not Data Found in this secction!" />
          }
          {Object.keys(yourData.notes).length !== 0 && !loader && filNotes.length === 0 &&
            Object.values(yourData.notes).map(el => <RenderNote key={el.id} note={el} storage={storage} setEditData={setEditData} setTip={setTip} />)
          }
          {filNotes.length !== 0 && 
            Object.values(yourData.notes).map(el => el.keyword.toLowerCase().includes(filNotes.join("")) ? <RenderNote key={el.id} note={el} storage={storage} setEditData={setEditData} setTip={setTip} /> : "")
          }
        </div>
      </div>

      <br />

      <div className="card m-3 text-bg-warning h4">
        <div className="d-flex justify-content-between">
            <div className="p-3">
              Your Thing&apos;s list to do
            </div>
            <div className="p-3">
              <input type="text" className="form-control" placeholder="Title" onKeyUp={handleKeyUpList} />
            </div>
        </div>
      </div>

      <div className="list-group">
        {Object.keys(yourData.list).length === 0 && loader &&
        <div className='text-center'>
          <Loader />
        </div>
        }
        {Object.keys(yourData.list).length === 0 && !loader &&
          <NotDataFound message="Not Data Found in this secction!" />
        }
        {Object.keys(yourData.list).length !== 0 && !loader && filList.length === 0 &&
          Object.values(yourData.list).map(el => <RenderList key={el.id} toDo={el} storage={storage} setEditData={setEditData} setTip={setTip} />)
        }
        {filList.length !== 0 &&
          Object.values(yourData.list).map(el => el.title.toLowerCase().includes(filList.join("")) ? <RenderList key={el.id} toDo={el} storage={storage} setEditData={setEditData} setTip={setTip} /> : "")
        }
      </div>

      <div style={{"borderTop": "1px solid #eaeaea"}}></div>

      {!notificationAllowed &&
        <NotNotifications message="Notifications&apos;s not working, change notification's permission" />
      }
      {errorSW &&
        <NotNotifications message="You are not able to recieve notifications. Change your browser" />
      }

      <footer className={styles.footer}>
        <div className="btn-group container-lg" role="group" aria-label="Basic mixed styles example">
          <button type="button" onClick={() => setTip({note:true, list:false})} className="btn btn-success">Add Note</button>
          <button type="button" onClick={() => setTip({note:false, list:true})} className="btn btn-success">Add Thing to do</button>
        </div>
      </footer>

      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossOrigin="anonymous" />
    </div>
  )
}

export default Home