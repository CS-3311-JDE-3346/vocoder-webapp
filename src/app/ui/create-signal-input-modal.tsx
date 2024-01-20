import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useRef, useState } from "react";
import { WaveForm, WaveSurfer } from "wavesurfer-react";
import RecordPlugin from "wavesurfer.js/dist/plugins/record";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline";

export default function CreateSignalInputModal({
  isOpen,
  onOpenChange,
  signalType,
  setSignals,
  createFromFile,
}) {
  const [formError, setFormError] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState();

  const wavesurferRef = useRef();

  const plugins = [
    {
      plugin: RecordPlugin,
    },
    {
      plugin: TimelinePlugin,
      options: {
        container: `#timeline-record`,
      },
    },
  ];

  const handleWSMount = (waveSurfer) => {
    wavesurferRef.current = waveSurfer;
    const record = waveSurfer.plugins[0];
    record.on("record-end", (blob) => {
      setRecordingUrl(URL.createObjectURL(blob));
    });

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
    }
  };

  const createSignalFromFile = (onClose, formData: FormData) => {
    if (!formData.get("name") || !formData.get("file")) {
      setFormError("Please specify a name and audio file");
      return;
    }

    setSignals((prev) => [
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

  const createSignalFromRecording = (onClose, formData: FormData) => {
    if (!formData.get("name") || !recordingUrl) {
      setFormError("Please specify a name and record an audio clip");
      return;
    }

    setSignals((prev) => [
      ...prev,
      {
        name: formData.get("name"),
        label: formData.get("name"),
        filename: recordingUrl,
      },
    ]);

    setFormError("");
    onClose();
  };

  return (
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
            action={(formData) => {
              if (createFromFile) {
                createSignalFromFile(onClose, formData);
              } else {
                createSignalFromRecording(onClose, formData);
              }
            }}
          >
            <ModalHeader className="flex flex-col gap-1">
              {`Create a new ${signalType} signal`}
            </ModalHeader>
            <ModalBody>
              <Input label="Name" name="name" labelPlacement="outside-left" />
              {createFromFile ? (
                <div className="flex">
                  <label htmlFor="file" className="text-sm">
                    Upload Signal
                  </label>
                  <input
                    id={`file-${signalType}`}
                    name="file"
                    type="file"
                    accept="audio/*"
                  />
                </div>
              ) : (
                <div>
                  <WaveSurfer plugins={plugins} onMount={handleWSMount}>
                    <WaveForm id={`waveform-record`}></WaveForm>
                    <div id={`timeline-record`} />
                  </WaveSurfer>
                  {isRecording ? (
                    <Button
                      onPress={() => {
                        if (wavesurferRef.current) {
                          const record = wavesurferRef.current.plugins[0];
                          record.stopRecording();
                          setIsRecording(false);
                        }
                      }}
                    >
                      Stop
                    </Button>
                  ) : (
                    <Button
                      onPress={() => {
                        if (wavesurferRef.current) {
                          const record = wavesurferRef.current.plugins[0];
                          record.startRecording();
                          setIsRecording(true);
                        }
                      }}
                    >
                      {recordingUrl ? "Re-record" : "Record"}
                    </Button>
                  )}
                </div>
              )}
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
  );
}
