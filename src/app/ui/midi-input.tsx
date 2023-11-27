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
import { useState } from "react";
let MidiParser = require('midi-parser-js');

const defaultMIDISignals = [
  {
    name: "hello",
    label: "Hello example",
    filename: "/hello_example.mid",
  },
];

export default function MidiInput() {
  const [MIDIsignals, setMIDIsignals] = useState(defaultMIDISignals);
  const [formError, setFormError] = useState<string>("");
  const [value, setValue] = useState(new Set(["hello"]));
  const [isPlaying, setIsPlaying] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const createMidiInput = (onClose, formData: FormData) => {
    if (!formData.get("name") || !formData.get("file")) {
      setFormError("Please specify a name and audio file");
      return;
    }
    //add in another condition to not allow file types that are not .mid or .midi

    setMIDIsignals((prev) => [
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

  const displayMidiInput = (file) => {
    var midi = MidiParser.parse(file);
    //find a way to visualize the midi files
  }
  
  return (
    <div className="p-2 rounded-lg drop-shadow-md bg-white">
      <div className="flex gap-4">
        <input
          className="hidden"
          name="modulator-signal"
          readOnly
          //value
        />
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
      <div>
        Display Contents of Midi File
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
              action={(formData) => createMidiInput(onClose, formData)}
            >
              <ModalHeader className="flex flex-col gap-1">
                Create a new MIDI Input
              </ModalHeader>
              <ModalBody>
                <Input label="Name" name="name" labelPlacement="outside-left" />
                <div className="flex">
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
  )
}