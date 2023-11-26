"use server";

import { mkdirSync, readFileSync } from "fs";

export async function runVocoder(prevState: any, formData: FormData) {
  const carrierSignalName = formData.get("carrier-signal");
  const modulatorSignal = formData.get("modulator-signal") as File;
  const showSteps = formData.get("show-steps") === "true";
  if (!carrierSignalName || !modulatorSignal) {
    return {
      error: "Must input valid a valid carrier signal and modulator signal",
    };
  }

  await new Promise((r) => setTimeout(r, 1000));
  const buffer = readFileSync("temp/hello_example.flac");
  // const blob = new Blob([buffer]);
  // console.log("server", blob)
  // const data = await response.blob();
  // const file = new File([data], "example.flac", {
  //   type: ".flac"
  // })

  return {
    message: "success",
    buffer: Buffer.from(buffer).toString('base64'),
  };
}
