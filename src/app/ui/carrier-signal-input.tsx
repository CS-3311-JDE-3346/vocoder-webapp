import { Image, Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";

const carrierSignals = [
  {
    name: "sine",
    label: "Sine wave",
    filename: "sine_example.wav",
    imagename: "sine_waveform.png",
  },
  {
    name: "square",
    label: "Square wave",
    filename: "square_example.wav",
    imagename: "square_waveform.png",
  },
  {
    name: "triangle",
    label: "Triangle wave",
    filename: "triangle_example.wav",
    imagename: "triangle_waveform.png",
  },
  {
    name: "sawtooth",
    label: "Sawtooth wave",
    filename: "sawtooth_example.wav",
    imagename: "sawtooth_waveform.png",
  },
];

export default function CarrierSignalInput() {
  const [value, setValue] = useState(new Set(["sine"]));
  const selectedCarrierSignal = carrierSignals.find(
    (c) => c.name === [...value][0]
  );

  return (
    <div className="p-2 rounded-lg drop-shadow-md bg-white">
      <Select
        label="Carrier Signal"
        name="carrier-signal"
        selectedKeys={value}
        onSelectionChange={setValue}
      >
        {carrierSignals.map((carrierSignal) => (
          <SelectItem key={carrierSignal.name} value={carrierSignal.name}>
            {carrierSignal.label}
          </SelectItem>
        ))}
      </Select>
      {selectedCarrierSignal && (
        <div className="p-6 flex flex-col items-center justify-center">
          <Image
            src={`/${selectedCarrierSignal.imagename}`}
            height={100}
            width={80}
            radius="none"
          />
          <audio controls key={selectedCarrierSignal.name} className="mt-6">
            <source src={`/${selectedCarrierSignal.filename}`} type="audio/wav" />
          </audio>
        </div>
      )}
    </div>
  );
}
