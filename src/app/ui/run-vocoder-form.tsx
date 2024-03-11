"use client";

import { useFormState, useFormStatus } from "react-dom";
import { runVocoder } from "../lib/actions";
import { Button, Switch } from "@nextui-org/react";
import MidiInput from "./midi-input";
import ModulatorSignalInput from "./modulator-signal-input";
import CarrierSignalInput from "./carrier-signal-input";
import ShowWaveform from "./show-waveform";
import { base64ToArrayBuffer } from "./utils";

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

export default function RunVocoderForm() {
  async function runVocoderWithFile(prevState: any, formData: FormData) {
    // add modulator signal to formData
    const modulatorSignalPath = formData.get("modulator-signal");
    if (!modulatorSignalPath) return;
    const blob = await fetch(modulatorSignalPath).then((r) => r.blob());
    formData.set("modulator-signal", blob);

    // add carrier signal to formData
    const carrierSignalPath = formData.get("carrier-signal");
    if (!carrierSignalPath) return;
    const blob2 = await fetch(carrierSignalPath).then((r) => r.blob());
    formData.set("carrier-signal", blob2);

    return await runVocoder(prevState, formData);
  }

  const initialState = { message: null, error: null };
  const [state, dispatch] = useFormState(runVocoderWithFile, initialState);
  const blob = state.buffer
    ? new Blob([base64ToArrayBuffer(state.buffer)], { type: ".wav" })
    : undefined;
  const blobUrl = blob && URL.createObjectURL(blob)

  return (
    <div>
      <form action={dispatch} className="">
        <ModulatorSignalInput />
        <div className="mt-4">
          <CarrierSignalInput />
        </div>
        <div className="flex items-center mt-4 justify-between">
          <Switch name="show-steps" value="true">
            Show steps
          </Switch>
          <SubmitButton />
          {state.error && <p className="text-red-600">{state.error}</p>}
        </div>
      </form>
      <ShowWaveform blob={blob} blobUrl={blobUrl} />
    </div>
  );
}
