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
import {
  NoteSequence,
  Player,
  Visualizer,
  urlToNoteSequence,
} from "@magenta/music";
let MidiParser = require("midi-parser-js");

const defaultMIDISignals = [
  {
    name: "Twinkle Twinkle Little Star",
    label: "Twinkle Twinkle Little Star",
    filename: "/twinkle_twinkle_little_star.mid",
  },
];

export default function MidiInput() {
  const [MIDIsignals, setMIDIsignals] = useState(defaultMIDISignals);
  const [formError, setFormError] = useState<string>("");
  const [value, setValue] = useState(new Set(["Twinkle Twinkle Little Star"]));
  const [isPlaying, setIsPlaying] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [currentNoteSequence, setCurrentNoteSequence] =
    useState<NoteSequence | null>();

  const vizRef = useRef<Visualizer>();
  const vizPlayerRef = useRef<Player>();

  const selectedMidi = MIDIsignals.find((c) => c.name === [...value][0]);
  useEffect(() => {
    const innerFunc = async () => {
      if (!selectedMidi) return;

      const noteSequence = await urlToNoteSequence(selectedMidi.filename);
      setCurrentNoteSequence(noteSequence);
    };
    innerFunc();
  }, [selectedMidi]);

  useEffect(() => {
    const innerFunc = async () => {
      if (!currentNoteSequence) return;
      const viz = new Visualizer(
        currentNoteSequence,
        document.getElementById("canvas")
      );
      vizRef.current = viz;

      if (vizPlayerRef.current) {
        vizPlayerRef.current.stop();
        setIsPlaying(false);
      }

      const vizPlayer = new Player(false, {
        run: (note) => viz.redraw(note),
        stop: () => {},
      });
      vizPlayerRef.current = vizPlayer;
    };
    innerFunc();
  }, [currentNoteSequence]);

  const createMidiInput = (onClose, formData: FormData) => {
    const name = formData.get("name")?.toString();
    const file: File | null = formData.get("file");
    if (!name || !file) {
      setFormError("Please specify a name and audio file");
      return;
    }

    if (file.type !== "audio/midi") {
      setFormError("File must end in .midi");
      return;
    }
    setMIDIsignals((prev) => [
      ...prev,
      {
        name: name,
        label: name,
        filename: URL.createObjectURL(file),
      },
    ]);

    setFormError("");
    onClose();
  };

  const vizPlayer = vizPlayerRef.current;
  return (
    <div className="p-2 rounded-lg drop-shadow-md bg-white">
      <div className="flex gap-4">
        <input className="hidden" name="modulator-signal" readOnly />
        <Select
          label="MIDI Input"
          selectedKeys={value}
          onSelectionChange={setValue}
        >
          {MIDIsignals.map((midiSignal) => (
            <SelectItem key={midiSignal.name} value={midiSignal.name}>
              {midiSignal.label}
            </SelectItem>
          ))}
        </Select>
        <Button onPress={onOpen}>Upload</Button>
      </div>
      <div className="overflow-x-auto mb-4">
        <canvas id="canvas"></canvas>
      </div>
      {vizPlayer &&
        (isPlaying ? (
          <Button
            onPress={() => {
              vizPlayer.pause();
              setIsPlaying(false);
            }}
          >
            Pause
          </Button>
        ) : (
          <Button
            onPress={() => {
              if (vizPlayer.getPlayState() === "paused") {
                vizPlayer.resume();
              } else {
                vizPlayer.start(currentNoteSequence);
              }
              setIsPlaying(true);
            }}
          >
            Play
          </Button>
        ))}
      {vizPlayer && (
        <Button
          onPress={() => {
            if (vizPlayer.getPlayState() !== "stopped") {
              vizPlayer.seekTo(0);
              vizPlayer.stop();
              setIsPlaying(false);

              vizRef.current?.clearActiveNotes();
            }
          }}
          className="ml-4"
        >
          Restart
        </Button>
      )}
      <Modal
        isOpen={isOpen}
        onOpenChange={() => {
          setFormError("");
          onOpenChange();
        }}
      >
        <ModalContent>
          {(onClose) => (
            <form action={(formData) => createMidiInput(onClose, formData)}>
              <ModalHeader className="flex flex-col gap-1">
                Create a new MIDI Input
              </ModalHeader>
              <ModalBody>
                <Input label="Name" name="name" labelPlacement="outside-left" />
                <div className="flex">
                  <input
                    id="file"
                    name="file"
                    type="file"
                    accept="audio/midi"
                  />
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
