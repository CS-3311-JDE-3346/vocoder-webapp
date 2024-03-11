"use client";

import { Button } from "@nextui-org/react";
import RunVocoderForm from "./ui/run-vocoder-form";
import Link from "next/link";
import React, { useState } from "react";
import Header from "./header";

export default function Home() {
  return (
    <main className="flex flex-col h-screen">
      <Header />
      <div className="flex-grow p-4">
        <RunVocoderForm />
      </div>
      <footer className="p-4">
        <Button color="secondary" className="float-right">
          <Link href="/education">Learn More About Vocoders!</Link>
        </Button>
      </footer>
      <script src="vocoder.js"></script>
      <script src="fileio.js"></script>
    </main>
  );
}
