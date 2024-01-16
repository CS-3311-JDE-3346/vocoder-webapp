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
    `ffmpeg -y -i temp/modulator_signal.wav -ar 44100 temp/modulator_signal_44100.wav`
  );
  execSync(
    `ffmpeg -y -i temp/carrier_signal.wav -ar 44100 temp/carrier_signal_44100.wav`
  );

  execSync(
    `./vocoder -c temp/carrier_signal_44100.wav -m temp/modulator_signal_44100.wav -o temp/output.wav`
  );

  execSync(
    `./vocoder -c temp/carrier_white_noise.wav -m temp/modulator_signal_44100.wav -o temp/output.wav`
  );

  const outputBuffer = readFileSync("temp/output.wav");
  return {
    message: "success",
    buffer: Buffer.from(outputBuffer).toString("base64"),
  };
}
