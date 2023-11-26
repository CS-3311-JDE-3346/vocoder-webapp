"use client";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { WaveForm, WaveSurfer } from "wavesurfer-react";
import RecordPlugin from "wavesurfer.js/dist/plugins/record";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline";

const defaultModulatorSignals = [
  {
    name: "hello",
    label: "Hello example",
    filename: "/hello_example.wav",
  },
];

export default function ModulatorSignalInput() {
  const [modulatorSignals, setModulatorSignals] = useState(
    defaultModulatorSignals
  );
  const [formError, setFormError] = useState<string>("");
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

  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.load(selectedModulatorSignal?.filename);
    }
  }, [value]);

  const handleWSMount = (waveSurfer) => {
    wavesurferRef.current = waveSurfer;

    if (wavesurferRef.current) {
      wavesurferRef.current.load("/hello_example.wav");
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

      // if (window) {
      //   window.surferidze = wavesurferRef.current;
      // }
    }
  };

  const createModulatorSignal = (onClose, formData: FormData) => {
    if (!formData.get("name") || !formData.get("file")) {
      setFormError("Please specify a name and audio file");
      return;
    }

    setModulatorSignals((prev) => [
      ...prev,
      {
        name: formData.get("name"),
        label: formData.get("name"),
        filename: URL.createObjectURL(formData.get("file")),
      },
    ]);

    setFormError("");
    onClose();
  };

  return (
    <div className="p-2 rounded-lg drop-shadow-md bg-white">
      <div className="flex gap-4">
        <input
          className="hidden"
          name="modulator-signal"
          readOnly
          value={selectedModulatorSignal?.filename}
        />
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
        <Button onPress={onOpen}>Add new</Button>
      </div>
      <div>
        <WaveSurfer plugins={plugins} onMount={handleWSMount}>
          <WaveForm id="waveform"></WaveForm>
          <div id="timeline" />
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
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={() => {
          setFormError("");
          onOpenChange();
        }}
      >
        <ModalContent>
          {(onClose) => (
            <form
              action={(formData) => createModulatorSignal(onClose, formData)}
            >
              <ModalHeader className="flex flex-col gap-1">
                Create a new modulator signal
              </ModalHeader>
              <ModalBody>
                <Input label="Name" name="name" labelPlacement="outside-left" />
                <div className="flex">
                  <label htmlFor="file" className="text-sm">
                    Upload Signal
                  </label>
                  <input id="file" name="file" type="file" accept="audio/*" />
                </div>
                {formError && <p className="text-red-600">{formError}</p>}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit">
                  Create
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
