"use server";

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";

export async function runVocoder(prevState: any, formData: FormData) {
  const carrierSignalName = formData.get("carrier-signal");
  const modulatorSignal = formData.get("modulator-signal") as File;
  const showSteps = formData.get("show-steps") === "true";
  if (!carrierSignalName || !modulatorSignal) {
    return {
      error: "Must input valid a valid carrier signal and modulator signal",
    };
  }

  const modulatorBuffer = Buffer.from(await modulatorSignal.arrayBuffer());
  writeFileSync("temp/modulator_signal.wav", modulatorBuffer);

  execSync(
    `ffmpeg -y -i temp/modulator_signal.wav -ar 44100 temp/modulator_signal_44100.wav`
  );

  execSync(
    `./vocoder -c public/${carrierSignalName}_example.wav -m temp/modulator_signal_44100.wav -o temp/output.wav`
  );

  execSync(
    `./vocoder -c temp/carrier_white_noise.wav -m temp/modulator_signal_44100.wav -o temp/output.wav`
  );

  await new Promise((r) => setTimeout(r, 1000));
  const outputBuffer = readFileSync("temp/output.wav");
  return {
    message: "success",
    buffer: Buffer.from(outputBuffer).toString("base64"),
  };
}
