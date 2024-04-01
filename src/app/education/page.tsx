"use client";

import {
  Button,
  Switch,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { FaCircleInfo } from "react-icons/fa6";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { app } from "../../../firebase/firebaseApp";
import Link from "next/link";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import React, { useState } from "react";
import Header from "../header";
import UserSettingActive from "../ui/user-settings";

export default function Home() {
  app;
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const [user, loading] = useAuthState(auth);
  const modal1 = useDisclosure();
  const modal2 = useDisclosure();
  const modal3 = useDisclosure();

  const [isComplete_1, setIsComplete_1] = useState(false);
  const [isComplete_2, setIsComplete_2] = useState(false);
  const [isComplete_3, setIsComplete_3] = useState(false);
  const learning_progress =
    ((isComplete_1 ? 1 : 0) + (isComplete_2 ? 1 : 0) + (isComplete_3 ? 1 : 0)) * 33.33333;
  function toggleSection(section) {
    if (section === 1) {
      setIsComplete_1((prevState) => !prevState);
    } else if (section === 2) {
      setIsComplete_2((prevState) => !prevState);
    } else if (section === 3) {
      setIsComplete_3((prevState) => !prevState);
    }
  }

  const signIn = async () => {
    const result = await signInWithPopup(auth, provider);
  };

  const SignStat = () => {
    if (user) {
      return (
        <Button
          onClick={() => auth.signOut()}
          className="bg-blue-700 text-slate-300"
        >
          Sign Out
        </Button>
      );
    } else {
      return (
        <Button onClick={signIn} className="bg-blue-700 text-slate-300">
          Sign In
        </Button>
      );
    }
  };

  return (
    <main className="flex flex-col h-screen">
      <Header />
      <div className="flex-grow p-4">
        <div className="flex-col text-center">
          <h2 className="mr-8 text-slate-800">
            Use the buttons below to navigate to helpful outside resources on
            vocoders and other components of music production
          </h2>
          &nbsp;
          <div className="flex-row flex justify-between">
            <Button
              className="basis-1/2 bg-blue-700 text-slate-300"
              onPress={modal1.onOpen}
            >
              Vocoder Basics
            </Button>
            <Modal
              size="5xl"
              isOpen={modal1.isOpen}
              onOpenChange={modal1.onOpenChange}
              onClose={modal1.onClose}
            >
              <ModalContent>
                <>
                  <ModalHeader className="bg-blue-300">
                    {" "}
                    Introduction to Vocoders{" "}
                  </ModalHeader>
                  <ModalBody>
                    <p>
                      Welcome to the journey of vocoders! In this tutorial, you
                      will learn the basics of vocoders as well as how to use
                      the simple one we have provided for you. While you will
                      receive guidance via the education page, it is important
                      to stress that
                      <b> Practice Makes Perfect! </b> Use these education tools
                      as a guidance. Your primary way of learning vocoders will
                      be through trial and error.
                    </p>
                    <p>
                      To start, click the link below for a brief introduction to
                      vocoders and how they work. Note that while the video
                      covers a specific vocoder software, the theory and
                      concepts still apply to this vocoder and the many other
                      vocoders you will use in your life.
                    </p>
                    <p className="text-center">
                      <a
                        href="https://www.youtube.com/watch?v=gru_8U0yltI"
                        target="_blank"
                      >
                        <b>Introduction to Vocoding Link</b>
                      </a>
                    </p>
                  </ModalBody>
                  <ModalFooter className="flex-row flex justify-between">
                    <a
                      href={"/vocoder_learning_content.pdf"}
                      download="/vocoder_learning_content.pdf"
                      target="_blank"
                    >
                      <Button className="flex justify-between bg-blue-700 text-slate-300">
                        Download as PDF
                      </Button>
                    </a>
                    <Button
                      className="flex justify-between bg-blue-700 text-slate-300"
                      onClick={() => toggleSection(1)}
                    >
                      {isComplete_1 ? "Mark as Incomplete" : "Mark as Complete"}
                    </Button>
                    <Button
                      className="flext justify-between bg-blue-700 text-slate-300"
                      onClick={modal1.onClose}
                    >
                      Close
                    </Button>
                  </ModalFooter>
                </>
              </ModalContent>
            </Modal>
            &nbsp; &nbsp;
            <Button
              className="basis-1/2 bg-blue-700 text-slate-300"
              onPress={modal2.onOpen}
            >
              Songs with Vocoders
            </Button>
            <Modal
              size="5xl"
              isOpen={modal2.isOpen}
              onOpenChange={modal2.onOpenChange}
              onClose={modal2.onClose}
            >
              <ModalContent>
                <>
                  <ModalHeader className="bg-blue-300">
                    {" "}
                    Where are Vocoders Used?{" "}
                  </ModalHeader>
                  <ModalBody>
                    <p>
                      So where are vocoders used? As one may guess, they are
                      used in the creation of music. However, music production
                      is not the only field of use. They are also used in other
                      areas like telecommunications, speech coding, robotics,
                      and security. They also find use in areas of entertainment
                      like video games. In all of these fields, vocoders play a
                      role in the audio systems and sounds that are commonly
                      used in said fields.
                    </p>
                    <p>
                      Looking at the field of music, there are many songs that
                      use vocoders. Many of these songs are well known songs in
                      the United States and around the world, sung by famous
                      music artists. Some examples of famous songs that use
                      vocoders are shown below.
                      <b>
                        <ul className="text-center text-blue-400">
                          <li>California Love - Tupac & Dr. Dre</li>
                          <li>Intergalactic - Beastie Boys</li>
                          <li>In the Air Tonight - Phil Collins</li>
                          <li>Favorite Color - Carly Rae Jepsen</li>
                          <li>Almost every Daft Punk song</li>
                        </ul>
                      </b>
                    </p>
                    <p>
                      These are only the few of the massive amounts of music
                      that use vocoders in them. We hope that this website is
                      the start of a journey for you to be able to produce music
                      like this in the future.
                    </p>
                  </ModalBody>
                  <ModalFooter className="flex-row flex justify-between">
                    <a
                      href={"/vocoder_learning_content.pdf"}
                      download="/vocoder_learning_content.pdf"
                      target="_blank"
                    >
                      <Button className="flex justify-between bg-blue-700 text-slate-300">
                        Download as PDF
                      </Button>
                    </a>
                    <Button
                      className="flex justify-between bg-blue-700 text-slate-300"
                      onClick={() => toggleSection(2)}
                    >
                      {isComplete_2 ? "Mark as Incomplete" : "Mark as Complete"}
                    </Button>
                    <Button
                      className="flext justify-between bg-blue-700 text-slate-300"
                      onClick={modal2.onClose}
                    >
                      Close
                    </Button>
                  </ModalFooter>
                </>
              </ModalContent>
            </Modal>
          </div>
          <div className="flex-row flex justify-between">
            <Button
              className="basis-1/2 bg-blue-700 text-slate-300"
              onPress={modal3.onOpen}
            >
              How can Vocoders be Used?
            </Button>
            <Modal
              size="5xl"
              isOpen={modal3.isOpen}
              onOpenChange={modal3.onOpenChange}
              onClose={modal3.onClose}
            >
              <ModalContent>
                <>
                  <ModalHeader className="bg-blue-300">
                    {" "}
                    How can Vocoders be Used?{" "}
                  </ModalHeader>
                  <ModalBody>
                    <p>
                      Now that we have talked about the versatility of vocoders,
                      Lets discuss how they can be used. This vocoder on the website
                      is a basic one that contains a modulator signal, a carrier signal,
                      a midi, a sythesizer, and the output, which is your result.
                      We encourage you to fiddle with everything and try it out for 
                      yourself. This will allow you to see patterns and get a better
                      understanding of how the vocoder works and how the features affect
                      the final sound. We have some brief descriptions below of what the
                      features do.
                    </p>
                    <h3> <b>Modulator Signal</b> </h3>
                    <p>
                      In a vocoder, the modulator signal provides the input voice or sound 
                      source that is analyzed and used to modulate a carrier signal, creating 
                      synthesized sounds that retain some of the characteristics of the 
                      original modulator signal. This process is what allows vocoders to create 
                      distinctive voice effects and synthetic sounds commonly heard in music 
                      production and audio processing.
                    </p>
                    <h3> <b>Carrier Signal</b> </h3>
                    <p>
                      In summary, a carrier signal is essential in modulation processes 
                      because it provides the framework or structure onto which information 
                      from the modulator signal is imposed. It acts as a medium for 
                      transmitting the modulating signal's information, which is encoded in 
                      various ways depending on the modulation technique employed.
                    </p>
                    <h3> <b>Midi and Synthesizer</b> </h3>
                    <p>
                      You have probably seen a midi if you have produced any music before. A midi
                      allows for precise manipulation of an audio file. In the context of vocoders,
                      midi allows for the sound you make in vocoders to be accurately changed and 
                      manipulated, effectively bringing the functions of the midi to a vocoder in 
                      order to allow more functionality in the vocoder.
                    </p>
                    <p>
                      The synthesizer in a vocoder setup plays a crucial role in generating the 
                      carrier signal, shaping its timbral qualities, and providing the musical 
                      context onto which the modulator signal is imposed to create the distinctive vocoder effect.
                    </p>
                    <h3 className="text-center"><b>
                      Now that you have a basic understanding of this vocoder's features, go try it out
                      for yourself. Turn on the explanation mode toggle for a step by step walkthrough
                      if you need one.
                    </b></h3>
                  </ModalBody>
                  <ModalFooter className="flex-row flex justify-between">
                    <a
                      href={"/vocoder_learning_content.pdf"}
                      download="/vocoder_learning_content.pdf"
                      target="_blank"
                    >
                      <Button className="flex justify-between bg-blue-700 text-slate-300">
                        Download as PDF
                      </Button>
                    </a>
                    <Button
                      className="flex justify-between bg-blue-700 text-slate-300"
                      onClick={() => toggleSection(3)}
                    >
                      {isComplete_3 ? "Mark as Incomplete" : "Mark as Complete"}
                    </Button>
                    <Button
                      className="flext justify-between bg-blue-700 text-slate-300"
                      onClick={modal2.onClose}
                    >
                      Close
                    </Button>
                  </ModalFooter>
                </>
              </ModalContent>
            </Modal>
          </div>
        </div>
      </div>
      <footer className="p-4">
        <div className="float-left">
          <div>Learning Progress: {learning_progress}%</div>
          <div
            style={{
              width: "200px",
              height: "20px",
              border: "2px solid black",
            }}
          >
            <div
              style={{
                width: `${learning_progress}%`,
                height: "100%",
                backgroundColor: "blue",
              }}
            ></div>
          </div>
          <div></div>
        </div>
        <Button color="secondary" className="float-right">
          <Link href="/">Back to the Vocoder</Link>
        </Button>
      </footer>
    </main>
  );
}
