"use server";

export async function runVocoder(prevState: any, formData: FormData) {
  const carrierSignalName = formData.get("carrier-signal");
  const modulatorSignal = formData.get("modulator-signal") as File;
  const showSteps = formData.get("show-steps") === "true";
  if (!carrierSignalName || !modulatorSignal) {
    return {
      error: "Must input valid a valid carrier signal and modulator signal",
    };
  }

  await new Promise((r) => setTimeout(r, 2000));

  return {
    message: "success",
  };
}
