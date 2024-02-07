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
import RecordPlugin from "wavesurfer.js/dist/plugins/record";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline";
import CreateSignalInputModal from "./create-signal-input-modal";

export default function SignalInput({
  initialSignals,
  defaultSignalName,
  formInputLabel,
  signalType,
}) {
  const [signals, setSignals] = useState(initialSignals);
  const [value, setValue] = useState(new Set([defaultSignalName]));
  const [isPlaying, setIsPlaying] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [createFromFile, setCreateFromFile] = useState(true); // controls if the modal should create signal from file or record audio

  const selectedSignal = signals.find((c) => c.name === [...value][0]);

  const wavesurferRef = useRef();

  const plugins = [
    {
      plugin: TimelinePlugin,
      options: {
        container: `#timeline-${signalType}`,
      },
    },
  ];

  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.load(selectedSignal?.filename);
    }
  }, [value]);

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
          name={`${signalType}-signal`}
          readOnly
          value={selectedSignal?.filename}
        />
        <Select
          label={formInputLabel}
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
                setCreateFromFile(true);
                onOpen();
              }}
            >
              From file
            </DropdownItem>
            <DropdownItem
              key="recording"
              onPress={() => {
                setCreateFromFile(false);
                onOpen();
              }}
            >
              From recording
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div>
        <WaveSurfer plugins={plugins} onMount={handleWSMount}>
          <WaveForm id={`waveform-${signalType}`}></WaveForm>
          <div id={`timeline-${signalType}`} />
        </WaveSurfer>
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
          <Button
            className="ml-4"
          >
            Filter
          </Button>
        </div>
      </div>
      <CreateSignalInputModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        signalType={signalType}
        signals={signals}
        setSignals={setSignals}
        createFromFile={createFromFile}
      />
    </div>
  );
}
