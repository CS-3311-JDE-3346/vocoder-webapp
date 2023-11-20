"use client";

import { useFormState, useFormStatus } from "react-dom";
import { runVocoder } from "../lib/actions";
import { Button, Switch } from "@nextui-org/react";
import MidiInput from "./midi-input";
import ModulatorSignalInput from "./modulator-signal-input";
import CarrierSignalInput from "./carrier-signal-input";
import ShowWaveform from "./show-waveform";

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

    return await runVocoder(prevState, formData);
  }

  const initialState = { message: null, error: null };
  const [state, dispatch] = useFormState(runVocoderWithFile, initialState);

  return (
    <div>
      <form action={dispatch} className="">
        <div className="flex gap-8">
          <CarrierSignalInput />
          <div className="flex-grow">
            <ModulatorSignalInput />
          </div>
        </div>
        <div className="mt-4">
          <MidiInput />
        </div>
        <div className="flex items-center mt-4 justify-between">
          <Switch name="show-steps" value="true">
            Show steps
          </Switch>
          <SubmitButton />
          { state.error && <p className="text-red-600">{state.error}</p>}
        </div>
      </form>
      <ShowWaveform />
    </div>
  );
}
