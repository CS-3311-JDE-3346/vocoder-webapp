'use client'

import { Button, Switch } from "@nextui-org/react";
import { FaCircleInfo } from "react-icons/fa6";
import RunVocoderForm from "../ui/run-vocoder-form";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { app } from "../../../firebase/firebaseApp";
import Link from "next/link";

export default function Home() {

    app;
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const [user, loading] = useAuthState(auth);
  
    const signIn = async () => {
      const result = await signInWithPopup(auth, provider);
    }
  
    const SignStat = () => {
      if (user) {
        return <Button onClick={() => auth.signOut()} className="bg-blue-700 text-slate-300">Sign Out</Button>;
      } else {
        return <Button onClick={signIn} className="bg-blue-700 text-slate-300">Sign In</Button>;
      }
    }  

    return (
        <main className="flex flex-col h-screen">
          <header className="flex justify-between p-4 bg-blue-300 drop-shadow">
            <div className="flex items-center">
              {/* implement using NextUI Dropdown */}
              <Button className="bg-blue-700 text-slate-300">File</Button>
            </div>
            <h1 className="mr-8 font-bold text-slate-800">Learn More About Vocoders!</h1>
            <div className="flex">
              <SignStat /> &nbsp;&nbsp;
            </div>
          </header>
          <div className="flex-grow p-4">
            <div className="flex-col text-center">
              <h2 className="mr-8 text-slate-800">Use the links below to navigate 
                to helpful outside resources on vocoders and other components of music production
              </h2>
              &nbsp;
              <div className="flex-row">
                <Button className="bg-blue-700 text-slate-300">Vocoder Basics</Button>
                &nbsp;
                &nbsp;
                <Button className="bg-blue-700 text-slate-300">Test</Button>
              </div>
            </div>
          </div>
          <footer className="p-4">
            <Button color="secondary" className="float-right">
              <Link href="/">Back to the Vocoder</Link>
            </Button>
          </footer>
        </main>
    );
}