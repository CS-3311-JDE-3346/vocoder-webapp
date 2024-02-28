"use server";

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";

export async function runVocoder(prevState: any, formData: FormData) {
  const midiInput = formData.get("midi-input") as File;
  const modulatorSignal = formData.get("modulator-signal") as File;
  const showSteps = formData.get("show-steps") === "true";
  if (!midiInput || !modulatorSignal) {
    return {
      error: "Must input valid a valid carrier signal and modulator signal",
    };
  }

  const modulatorBuffer = Buffer.from(await modulatorSignal.arrayBuffer());
  writeFileSync("temp/modulator_signal.wav", modulatorBuffer);

  // synthesize midi
  const midiInputBuffer = Buffer.from(await midiInput.arrayBuffer());
  writeFileSync("temp/midi_input.mid", midiInputBuffer);
  execSync(
    `fluidsynth -F temp/carrier_signal_44100.wav --sample-rate 44100 --audio-channels 1 -g 5 public/guitars.sf2 temp/midi_input.mid`
  );
  execSync(
    `ffmpeg -y -i temp/carrier_signal_44100.wav -ac 1 temp/carrier_signal_44100_c.wav`
  );

  execSync(
    `ffmpeg -y -i temp/modulator_signal.wav -ar 44100 -ac 1 temp/modulator_signal_44100.wav`
  );

  // run vocoder
  execSync(
    `./vocoder -c temp/carrier_signal_44100_c.wav -m temp/modulator_signal_44100.wav -o temp/output.wav`
  );

  // execSync(
  //   `./vocoder -c temp/carrier_white_noise.wav -m temp/modulator_signal_44100.wav -o temp/output.wav`
  // );

  const outputBuffer = readFileSync("temp/output.wav");
  return {
    message: "success",
    buffer: Buffer.from(outputBuffer).toString("base64"),
  };
}
