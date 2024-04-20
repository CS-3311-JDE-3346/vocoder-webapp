"use client";

import { Button } from "@nextui-org/react";
import RunVocoderForm from "./ui/run-vocoder-form";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Header from "./header";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { createRun, getRuns } from "./lib/actions";
import Theme from "./ui/theme";

export default function Home() {
  const [runId, setRunId] = useState<undefined | string>();
  const [runs, setRuns] = useState();

  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  const [isSwitchOn, setIsSwitchOn] = useState<boolean>(false);

  const toggleSwitch = () => {
    setIsSwitchOn(prevState => !prevState);
  }

  useEffect(() => {
    const inner = async () => {
      // if logged in, by default load a random run. If no runs exist, create new one
      if (user) {
        const idToken = await user.getIdToken();
        const runs = await getRuns(idToken);
        setRuns(runs);

        if (Object.keys(runs).length > 0) {
          setRunId(Object.keys(runs)[0]);
        } else {
          const runId = await createRun("Untitled Run", idToken);
          setRunId(runId ? runId : undefined);
        }
      }
    };
    inner();
  }, [user]);

  return (
    <main className="flex flex-col h-screen">
      <div className="dark:bg-black pb-4">
        <Header runs={runs} setRunId={setRunId} setRuns={setRuns} isSwitchOn={isSwitchOn} toggleSwitch={toggleSwitch} />
        <div className="flex-grow p-4">
          <RunVocoderForm runId={runId} setRuns={setRuns} isSwitchOn={isSwitchOn} />
        </div>
        <div>
            {isSwitchOn ? (
              <p className="text-center">Don't forget to download your result so you can save it!</p>
            ) : (
              <p></p>
            )}
          </div>
        <footer className="p-4">
          <Button color="secondary" className="float-right">
            <Link href="/education">Learn More About Vocoders!</Link>
          </Button>
          <Theme/>
        </footer>
        <script src="vocoder.js"></script>
        <script src="fileio.js"></script>
      </div>
      
    </main>
  );
}
