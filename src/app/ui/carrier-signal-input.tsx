"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { WaveForm, WaveSurfer } from "wavesurfer-react";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline";
import CreateSignalInputFromFileModal from "./modals/create-signal-input-from-file-modal";
import CreateSignalInputFromMidiModal from "./modals/create-signal-input-from-midi-modal ";
import { synthesizeMidi } from "../lib/actions";
import { base64ToArrayBuffer } from "./utils";

const defaultCarrierSignals = [
  // {
  //   name: "Sine wave",
  //   label: "Sine wave",
  //   file_name: "/sine_example.wav",
  //   audio_name: "/sine_example.wav",
  //   isAudio: true,
  // },
  {
    name: "Twinkle Twinkle Little Star",
    label: "Twinkle Twinkle Little Star",
    file_name: "/twinkle_twinkle_little_star.mid",
    audio_name: undefined, // synthesized by calling server action
    isAudio: false,
  },
];

export default function CarrierSignalInput({}) {
  const [signals, setSignals] = useState(defaultCarrierSignals);
  const [value, setValue] = useState(new Set(["Twinkle Twinkle Little Star"]));
  const [audioName, setAudioName] = useState<string | undefined>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const {
    isOpen: isOpenFile,
    onOpen: onOpenFile,
    onOpenChange: onOpenChangeFile,
  } = useDisclosure();
  const {
    isOpen: isOpenMidi,
    onOpen: onOpenMidi,
    onOpenChange: onOpenChangeMidi,
  } = useDisclosure();
  useEffect(() => {
    const selectedSignal = signals.find((c) => c.name === [...value][0]);
    setAudioName(selectedSignal?.audio_name);
  }, [value]);

  const wavesurferRef = useRef();

  const plugins = [
    {
      plugin: TimelinePlugin,
      options: {
        container: `#timeline-carrier`,
      },
    },
  ];

  useEffect(() => {
    const inner = async () => {
      const selectedSignal = signals.find((c) => c.name === [...value][0]);
      if (wavesurferRef.current && selectedSignal) {
        if (audioName) {
          wavesurferRef.current.load(audioName);
        } else {
          setIsSynthesizing(true);

          const blob = await fetch(selectedSignal.file_name).then((r) =>
            r.blob()
          );

          // cant pass blob to server action, must create formdata and attach it
          const formData = new FormData();
          formData.set("midi-input", blob);
          formData.set("synth-name", "Guitars");
          const result = await synthesizeMidi(formData);
          if (result.buffer) {
            const blob = new Blob([base64ToArrayBuffer(result.buffer)], {
              type: ".wav",
            });

            const newAudioName = URL.createObjectURL(blob);
            selectedSignal.audio_name = newAudioName;
            setAudioName(newAudioName);
          } else {
            console.error("Error when synthesizing midi");
          }
          setIsSynthesizing(false);
        }
      }
    };
    inner();
  }, [audioName]);

  const handleWSMount = (waveSurfer) => {
    wavesurferRef.current = waveSurfer;

    if (wavesurferRef.current) {
      wavesurferRef.current.on("ready", () => {
        // console.log("WaveSurfer is ready");
      });

      wavesurferRef.current.on("loading", (data) => {
        // console.log("loading --> ", data);
      });

      wavesurferRef.current.on("play", (data) => {
        setIsPlaying(true);
      });

      wavesurferRef.current.on("pause", (data) => {
        setIsPlaying(false);
      });

      // if (window) {
      //   window.surferidze = wavesurferRef.current;
      // }
    }
  };

  return (
    <div className="p-2 rounded-lg drop-shadow-md bg-white flex-grow">
      <div className="flex gap-4">
        <input
          className="hidden"
          name={`carrier-signal`}
          readOnly
          value={audioName}
        />
        <Select
          label="Carrier Signal"
          selectedKeys={value}
          onSelectionChange={setValue}
          disallowEmptySelection
        >
          {signals.map((signal) => (
            <SelectItem key={signal.name} value={signal.name}>
              {signal.label}
            </SelectItem>
          ))}
        </Select>
        <Dropdown>
          <DropdownTrigger>
            <Button>Create</Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Select how to create a new signal">
            <DropdownItem
              key="file"
              onPress={() => {
                onOpenFile();
              }}
            >
              From audio file
            </DropdownItem>
            <DropdownItem
              key="recording"
              onPress={() => {
                onOpenMidi();
              }}
            >
              From midi file
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div>
        <div className={"mt-4 text-center " + (isSynthesizing ? "" : "hidden")}>
          Synthesizing midi file...
        </div>
        <div className={isSynthesizing ? "hidden" : ""}>
          <WaveSurfer plugins={plugins} onMount={handleWSMount}>
            <WaveForm id={`waveform-carrier`}></WaveForm>
            <div id={`timeline-carrier`} />
          </WaveSurfer>
        </div>
        <div className="mt-6">
          {isPlaying ? (
            <Button onPress={() => wavesurferRef.current.pause()}>Pause</Button>
          ) : (
            <Button onPress={() => wavesurferRef.current.play()}>Play</Button>
          )}
          <Button
            onPress={() => wavesurferRef.current.seekTo(0)}
            className="ml-4"
          >
            Restart
          </Button>
          <Button className="ml-4">Filter</Button>
        </div>
      </div>
      <CreateSignalInputFromFileModal
        isOpen={isOpenFile}
        onOpenChange={onOpenChangeFile}
        signalType="carrier"
        signals={signals}
        setSignals={setSignals}
      />
      <CreateSignalInputFromMidiModal
        isOpen={isOpenMidi}
        onOpenChange={onOpenChangeMidi}
        signalType="carrier"
        signals={signals}
        setSignals={setSignals}
      />
    </div>
  );
}
