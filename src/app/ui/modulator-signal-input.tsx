"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import { useRef, useState } from "react";
import { WaveForm, WaveSurfer } from "wavesurfer-react";
import RecordPlugin from "wavesurfer.js/dist/plugins/record";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline";

const modulatorSignals = [
  {
    name: "hello",
    label: "Hello example",
    filename: "hello_example.flac",
  },
];

export default function ModulatorSignalInput() {
  const [value, setValue] = useState(new Set(["hello"]));
  const [isPlaying, setIsPlaying] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const selectedModulatorSignal = modulatorSignals.find(
    (c) => c.name === [...value][0]
  );

  const wavesurferRef = useRef();

  const plugins = [
    {
      plugin: RecordPlugin,
    },
    {
      plugin: TimelinePlugin,
      options: {
        container: "#timeline",
      },
    },
  ];

  const handleWSMount = (waveSurfer) => {
    wavesurferRef.current = waveSurfer;

    if (wavesurferRef.current) {
      wavesurferRef.current.load("/hello_example.flac");
      // console.log(wavesurferRef.current.plugins[0].startRecording())

      wavesurferRef.current.on("ready", () => {
        console.log("WaveSurfer is ready");
      });

      wavesurferRef.current.on("loading", (data) => {
        console.log("loading --> ", data);
      });

      wavesurferRef.current.on("play", (data) => {
        setIsPlaying(true);
      });

      wavesurferRef.current.on("pause", (data) => {
        setIsPlaying(false);
      });

      if (window) {
        window.surferidze = wavesurferRef.current;
      }
    }
  };

  return (
    <div>
      <div className="flex">
        <Select
          label="Modulator Signal"
          selectedKeys={value}
          onSelectionChange={setValue}
        >
          {modulatorSignals.map((modulatorSignal) => (
            <SelectItem key={modulatorSignal.name} value={modulatorSignal.name}>
              {modulatorSignal.label}
            </SelectItem>
          ))}
        </Select>
        <Button onPress={onOpen}>Add</Button>
      </div>
      <div>
        <WaveSurfer plugins={plugins} onMount={handleWSMount}>
          <WaveForm id="waveform"></WaveForm>
          <div id="timeline" />
        </WaveSurfer>
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
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>hi</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
