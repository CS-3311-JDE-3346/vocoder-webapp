"use client";

import { useFormState, useFormStatus } from "react-dom";
import { runVocoder } from "../lib/actions";
import { Button, Switch } from "@nextui-org/react";
import MidiInput from "./midi-input";
import ModulatorSignalInput from "./modulator-signal-input";
import CarrierSignalInput from "./carrier-signal-input";
import ShowWaveform from "./show-waveform";
import SignalInput from "./signal-input";

const defaultCarrierSignals = [
  {
    name: "Sine wave",
    label: "Sine wave",
    filename: "/sine_example.wav",
    imagename: "sine_waveform.png",
  },
  {
    name: "Square wave",
    label: "Square wave",
    filename: "/square_example.wav",
    imagename: "square_waveform.png",
  },
  {
    name: "Triangle wave",
    label: "Triangle wave",
    filename: "/triangle_example.wav",
    imagename: "triangle_waveform.png",
  },
  {
    name: "Sawtooth wave",
    label: "Sawtooth wave",
    filename: "/sawtooth_example.wav",
    imagename: "sawtooth_waveform.png",
  },
];

const defaultModulatorSignals = [
  {
    name: "Hello example",
    label: "Hello example",
    filename: "/hello_example.wav",
  },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      color="primary"
      isLoading={pending}
      className="max-w-sm"
    >
      Run
    </Button>
  );
}

function base64ToArrayBuffer(base64) {
  var binaryString = atob(base64);
  var bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export default function RunVocoderForm() {
  async function runVocoderWithFile(prevState: any, formData: FormData) {
    // add modulator signal to formData
    const modulatorSignalPath = formData.get("modulator-signal");
    if (!modulatorSignalPath) return;
    const blob = await fetch(modulatorSignalPath).then((r) => r.blob());
    formData.set("modulator-signal", blob);

    // add midi input to formData
    const midiInputPath = formData.get("midi-input");
    if (!midiInputPath) return;
    const blob2 = await fetch(midiInputPath).then((r) => r.blob());
    formData.set("midi-input", blob2);

    return await runVocoder(prevState, formData);
  }

  const initialState = { message: null, error: null };
  const [state, dispatch] = useFormState(runVocoderWithFile, initialState);
  const blob = state.buffer
    ? new Blob([base64ToArrayBuffer(state.buffer)], { type: ".wav" })
    : undefined;

  return (
    <div>
      <form action={dispatch} className="">
        <div className="flex gap-8">
          <SignalInput
            initialSignals={defaultCarrierSignals}
            defaultSignalName="Sine wave"
            formInputLabel="Carrier Signal"
            signalType="carrier"
          />
          <SignalInput
            initialSignals={defaultModulatorSignals}
            defaultSignalName="Hello example"
            formInputLabel="Modulator Signal"
            signalType="modulator"
          />
        </div>
        <div className="mt-4">
          <MidiInput />
        </div>
        <div className="flex items-center mt-4 justify-between">
          <Switch name="show-steps" value="true">
            Show steps
          </Switch>
          <SubmitButton />
          {state.error && <p className="text-red-600">{state.error}</p>}
        </div>
      </form>
      <ShowWaveform blob={blob} />
    </div>
  );
}
