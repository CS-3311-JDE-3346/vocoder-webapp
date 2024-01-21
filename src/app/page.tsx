'use client'

import { Button, Switch } from "@nextui-org/react";
import { FaCircleInfo } from "react-icons/fa6";
import RunVocoderForm from "./ui/run-vocoder-form";
import { initFbase } from "../../firebase/firebaseApp";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Home() {

  initFbase();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const [user, loading] = useAuthState(auth);

  const signIn = async () => {
    const result = await signInWithPopup(auth, provider);
  }

  return (
    <main className="flex flex-col h-screen">
      <header className="flex justify-between p-4 bg-blue-300 drop-shadow">
        <div className="flex items-center">
          <p className="mr-8 font-bold text-slate-800">Learn Vocoders</p>
          {/* implement using NextUI Dropdown */}
          <Button className="bg-blue-700 text-slate-300">File</Button>
        </div>
        <div className="flex">
          <Button onClick={signIn} className="bg-blue-700 text-slate-300">Sign In</Button>
          <Button onClick={() => auth.signOut()} className="bg-blue-700 text-slate-300">Sign Out</Button>
          <Switch
            defaultChecked={false}
            color="primary"
            endContent={<FaCircleInfo />}
          >
            Explanation mode
          </Switch>
        </div>
      </header>
      <div className="flex-grow p-4">
        <RunVocoderForm />
      </div>
      <footer className="p-4">
        <Button color="secondary" className="float-right">
          Learn More About Vocoders!
        </Button>
      </footer>
    </main>
  );
}
