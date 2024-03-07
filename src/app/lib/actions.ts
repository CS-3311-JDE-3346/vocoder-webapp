"use server";

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";

export async function runVocoder(prevState: any, formData: FormData) {
  const carrierSignal = formData.get("carrier-signal") as File;
  const modulatorSignal = formData.get("modulator-signal") as File;
  const showSteps = formData.get("show-steps") === "true";
  if (!carrierSignal || !modulatorSignal) {
    return {
      error: "Must input valid a valid carrier signal and modulator signal",
    };
  }

  const modulatorBuffer = Buffer.from(await modulatorSignal.arrayBuffer());
  writeFileSync("temp/modulator_signal.wav", modulatorBuffer);

  const carrierBuffer = Buffer.from(await carrierSignal.arrayBuffer());
  writeFileSync("temp/carrier_signal.wav", carrierBuffer);

  execSync(
    `ffmpeg -y -i temp/carrier_signal.wav -ar 44100 -ac 1 temp/carrier_signal_44100_c.wav`
  );

  execSync(
    `ffmpeg -y -i temp/modulator_signal.wav -ar 44100 -ac 1 temp/modulator_signal_44100.wav`
  );

  // run vocoder
  execSync(
    `./vocoder -c temp/carrier_signal_44100_c.wav -m temp/modulator_signal_44100.wav -o temp/output.wav`
  );

  const outputBuffer = readFileSync("temp/output.wav");
  return {
    message: "success",
    buffer: Buffer.from(outputBuffer).toString("base64"),
  };
}

export async function synthesizeMidi(formData: FormData) {
  const validSynths = new Set(["Drums", "Guitars", "Piano"]);

  const midiInput = formData.get("midi-input") as File;
  const synthName = formData.get("synth-name") as string;
  if (!midiInput || !synthName || !validSynths.has(synthName)) {
    return {
      error: "Must input a valid midi file and synth name",
    };
  }

  const midiInputBuffer = Buffer.from(await midiInput.arrayBuffer());
  writeFileSync("temp/midi_input.mid", midiInputBuffer);
  execSync(
    `fluidsynth -F temp/midi_output.wav --sample-rate 44100 --audio-channels 1 -g 5 public/${synthName}.sf2 temp/midi_input.mid`
  );

  const outputBuffer = readFileSync("temp/midi_output.wav");
  return {
    message: "success",
    buffer: Buffer.from(outputBuffer).toString("base64"),
  };
}
