import { Button } from "@nextui-org/react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col h-screen">
      <header className="flex justify-between">
        <div className="flex">
          <p>Learn Vocoders</p>
          <button>File</button>
        </div>
        <div className="flex">
          <p>Explanation mode</p>
          <button>toggle</button>
        </div>
      </header>
      <main className="flex-grow">
        <p>hi</p>
      </main>
      <footer>
        <Button color="secondary">Learn More About Vocoders!</Button>
      </footer>
    </main>
  );
}
