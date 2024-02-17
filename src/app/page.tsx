'use client'

import { Button, Switch } from "@nextui-org/react";
import { FaCircleInfo } from "react-icons/fa6";
import RunVocoderForm from "./ui/run-vocoder-form";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { app } from "../../firebase/firebaseApp";
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
          <p className="mr-8 font-bold text-slate-800">Learn Vocoders</p>
          {/* implement using NextUI Dropdown */}
          <Button className="bg-blue-700 text-slate-300">File</Button>
        </div>
        <div className="flex">
          <SignStat /> &nbsp;&nbsp;
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
          <Link href="/education">Learn More About Vocoders!</Link>
        </Button>
      </footer>
    </main>
  );
}
