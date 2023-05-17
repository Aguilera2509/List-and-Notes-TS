import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

interface firebase {
  apiKey: string,
  authDomain: string,
  databaseURL: string,
  projectId: string,
  storageBucket: string,
  messagingSenderId: string,
  appId: string,
  measurementId: string,
};

const firebaseConfig:firebase = {
  apiKey: `${process.env.NEXT_PUBLIC_APIKEY}`,
  authDomain: `${process.env.NEXT_PUBLIC_AUTHDOMAIN}`,
  databaseURL: `${process.env.NEXT_PUBLIC_DATABASEURL}`,
  projectId: `${process.env.NEXT_PUBLIC_PROJECTID }`,
  storageBucket: `${process.env.NEXT_PUBLIC_STORAGEBUCKET}`,
  messagingSenderId: `${process.env.NEXT_PUBLIC_MESSAGINGSENDERID}`,
  appId: `${process.env.NEXT_PUBLIC_APPID}`,
  measurementId: `${process.env.NEXT_PUBLIC_MEASUREMENTID}`
};

const app:any = initializeApp(firebaseConfig);
const database:any = getDatabase(app);

export { database, app };