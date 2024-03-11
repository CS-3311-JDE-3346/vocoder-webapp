"use client";

import { Button } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { WaveForm, WaveSurfer } from "wavesurfer-react";
import RecordPlugin from "wavesurfer.js/dist/plugins/record";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline";

export default function ShowWaveform({ blob, blobUrl }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const wavesurferRef = useRef();

  const plugins = [
    {
      plugin: RecordPlugin,
    },
    {
      plugin: TimelinePlugin,
      options: {
        container: "#timeline2",
      },
    },
  ];

  useEffect(() => {
    if (blob) {
      wavesurferRef.current.empty();
      wavesurferRef.current.loadBlob(blob);
    }
  }, [blob]);

  const handleWSMount = async (waveSurfer) => {
    wavesurferRef.current = waveSurfer;

    if (wavesurferRef.current) {
      wavesurferRef.current.on("ready", () => {
        console.log("WaveSurfer is ready");
      });

      wavesurferRef.current.on("loading", (data) => {
        console.log("loading --> ", data);
      });

      wavesurferRef.current.on("play", (data) => {
        setIsPlaying(true);
      });

      wavesurferRef.current.on("pause", (data) => {
        setIsPlaying(false);
      });

      // if (window) {
      //   window.surferidze = wavesurferRef.current;
      // }
    }
  };

  return (
    <div className="p-2 rounded-lg drop-shadow-md bg-white">
      <div>
        <div>Output</div>
        <div className="mt-6">
          {isPlaying ? (
            <Button onPress={() => wavesurferRef.current.pause()}>Pause</Button>
          ) : (
            <Button onPress={() => wavesurferRef.current.play()}>Play</Button>
          )}
          <Button
            onPress={() => wavesurferRef.current.seekTo(0)}
            className="ml-4"
          >
            Restart
          </Button>
        </div>
        <WaveSurfer plugins={plugins} onMount={handleWSMount}>
          <WaveForm id="waveform2"></WaveForm>
          <div id="timeline2" />
        </WaveSurfer>
        <div>
          <a href={"/output.wav"} download={blobUrl} target='_blank'>
            <Button>Download!</Button>
          </a>
        </div>
      </div>
    </div>
  );
}
