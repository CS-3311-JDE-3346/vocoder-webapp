'use client'

import { Button, Switch, useDisclosure } from "@nextui-org/react";
import { FaCircleInfo } from "react-icons/fa6";
import RunVocoderForm from "../ui/run-vocoder-form";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { app } from "../../../firebase/firebaseApp";
import Link from "next/link";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";

export default function Home() {

    app;
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const [user, loading] = useAuthState(auth);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
  
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
            <h1 className="mr-8 font-bold text-xl text-slate-800">Learn More About Vocoders!</h1>
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
              <div className="flex-row flex justify-between">
                <Button className="basis-1/2 bg-blue-700 text-slate-300" onPress={onOpen}>Vocoder Basics</Button>
                <Modal size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="bg-blue-300"> Introduction to Vocoders </ModalHeader>
                        <ModalBody>
                          <p>
                            Welcome to the journey of vocoders! In this tutorial, you will learn the basics
                            of vocoders as well as how to use the simple one we have provided for you. While
                            you will receive guidance via the education page, it is important to stress that
                            <b> Practice Makes Perfect! </b> Use these education tools as a guidance. Your primary
                            way of learning vocoders will be through trial and error.
                          </p>
                          <p>
                            To start, click the link below for a brief introduction to vocoders and how they work.
                            Note that while the video covers a specific vocoder software, the theory and concepts
                            still apply to this vocoder and the many other vocoders you will use in your life.
                          </p>
                          <p className="text-center">
                            <a href="https://www.youtube.com/watch?v=gru_8U0yltI" target="_blank"><b>Introduction to Vocoding Link</b></a>
                          </p>
                        </ModalBody>
                        <ModalFooter className="flex-row flex justify-between">
                          <Button className="flex justify-between bg-blue-700 text-slate-300">Download as PDF</Button>
                          <Button className="flext justify-between bg-blue-700 text-slate-300" onPress={onClose}>Close</Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
                &nbsp;
                &nbsp;
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