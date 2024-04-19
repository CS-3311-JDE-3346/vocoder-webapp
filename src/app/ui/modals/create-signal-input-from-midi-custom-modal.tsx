import { useEffect, useState } from "react";
import { Instrument } from "piano-chart";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";

export default function CreateSignalInputFromMidiModal({
  isOpen,
  onOpenChange,
  signalType,
  signals,
  setSignals,
  onSignalAdd,
}) {
  const [formError, setFormError] = useState<string>("");
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [piano, setPiano] = useState<Instrument | null>(null);

  useEffect(() => {
    if (isOpen) {
      const newPiano = new Instrument(document.getElementById("pianoContainer"), {
        startOctave: 3,
        endOctave: 5,
        showNoteNames: "always",
      });
      newPiano.create();

      newPiano.addKeyMouseDownListener((note) => {
        setSelectedNotes((prevNotes) => [...prevNotes, note]);
      });

      setPiano(newPiano);
    } else if (piano) {
      piano.destroy();
      setPiano(null);
    }
  }, [isOpen]);

  const resetSelectedNotes = () => {
    setSelectedNotes([]);
  };

  const createSignalFromNotes = (onClose, formData: FormData) => {
    if (!selectedNotes.length || !formData.get("name")) {
      setFormError("Please select at least one note and make sure a name is specified");
      return;
    }

    const newSignal = {
      name: document.getElementById("nameInput").value || "Unnamed",
      notes: selectedNotes,
      isAudio: false,
    };
    setSignals((prev) => [...prev, newSignal]);
    onSignalAdd(newSignal);

    setFormError("");
    setSelectedNotes([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={() => { setFormError(""); onOpenChange(); }}>
      <ModalContent>
        {(onClose) => (
            <form onSubmit={(event) => { event.preventDefault(); createSignalFromNotes(onClose, new FormData(event.target)); }}>
            <ModalHeader className="flex flex-col gap-1">
              {`Create a new ${signalType} signal`}
            </ModalHeader>
            <ModalBody>
              <Input id="nameInput" label="Name" name="name" labelPlacement="outside-left" />
              <div id="pianoContainer" />
              <div>Selected Notes: {selectedNotes.join(", ")}</div>
              {formError && <p className="text-red-600">{formError}</p>}
            </ModalBody>
            <ModalFooter>
              <Button color="light" variant="light" onPress={resetSelectedNotes}>
                Reset
              </Button>
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
  );
}
