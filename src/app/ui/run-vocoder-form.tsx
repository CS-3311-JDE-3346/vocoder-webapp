"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  createRun,
  getRunInfo,
  getRuns,
  runVocoder,
  saveNewSignalToRun,
  updateRunName,
} from "../lib/actions";
import { Button, Switch, Input } from "@nextui-org/react";
import MidiInput from "./midi-input";
import ModulatorSignalInput from "./modulator-signal-input";
import CarrierSignalInput from "./carrier-signal-input";
import ShowWaveform from "./show-waveform";
import { base64ToArrayBuffer } from "./utils";
import { FaPencil, FaCheck } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { defaultModulatorSignals, defaultCarrierSignals } from "../constants";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableItem } from "./sortable-item";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      color="primary"
      isLoading={pending}
      className="max-w-sm"
    >
      Run
    </Button>
  );
}

function loadSignals(origSignals) {
  const signals = [];
  for (let carrierSignal of origSignals) {
    const fileExtension = "." + carrierSignal.file_name.split(".").pop();
    const blob = new Blob([base64ToArrayBuffer(carrierSignal.buffer)], {
      type: fileExtension,
    });
    carrierSignal.file_name = URL.createObjectURL(blob);
    signals.push(carrierSignal);
  }
  return signals;
}

export default function RunVocoderForm({
  runId,
  setRuns,
  isSwitchOn,
}: {
  runId: string | undefined;
}) {
  // dnd kit
  const [items, setItems] = useState([1, 2, 3]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  // state
  const [modulatorSignals, setModulatorSignals] = useState(
    defaultModulatorSignals
  );
  const [carrierSignals, setCarrierSignals] = useState(defaultCarrierSignals);

  const [isEditingName, setIsEditingName] = useState(false);
  const [runName, setRunName] = useState("Untitled Run");
  const [runNameTemp, setRunNameTemp] = useState("Untitled Run");

  const [loading, setLoading] = useState(false);

  // firebase auth
  const auth = getAuth();
  const [user, authLoading] = useAuthState(auth);

  // load run data
  useEffect(() => {
    const inner = async () => {
      if (runId && user) {
        setLoading(true);
        const userToken = await user.getIdToken();
        const runInfo = await getRunInfo(runId, userToken);

        setRunName(runInfo["runName"]);
        setRunNameTemp(runInfo["runName"]);

        setModulatorSignals(
          loadSignals(Object.values(runInfo["modulatorSignals"]))
        );
        setCarrierSignals(
          loadSignals(Object.values(runInfo["carrierSignals"]))
        );
        setLoading(false);
      }
    };

    inner();
  }, [user, runId]);

  async function runVocoderWithFile(prevState: any, formData: FormData) {
    const runName = formData.get("run-name") as string;
    if (!runName) return;

    // add run id to formData
    formData.set("run-id", runId);

    // add user id to formData
    if (user) {
      formData.set("user-token", await user.getIdToken());
    }

    // add modulator signal to formData
    const modulatorSignalPath = formData.get("modulator-signal");
    if (!modulatorSignalPath) return;
    const blob = await fetch(modulatorSignalPath).then((r) => r.blob());
    formData.set("modulator-signal", blob);

    // add carrier signal to formData
    const carrierSignalPath = formData.get("carrier-signal");
    if (!carrierSignalPath) return;
    const blob2 = await fetch(carrierSignalPath).then((r) => r.blob());
    formData.set("carrier-signal", blob2);

    return await runVocoder(prevState, formData);
  }

  async function onSignalAdd(
    signal,
    type: "modulatorSignals" | "carrierSignals"
  ) {
    const blob = await fetch(signal.file_name).then((r) => r.blob());

    // cant pass blob to server action, must create formdata and attach it
    const formData = new FormData();
    formData.set("blob", blob);

    if (user) {
      saveNewSignalToRun(
        runId,
        signal,
        formData,
        type,
        await user.getIdToken()
      );
    }
  }

  const initialState = { message: null, error: null };
  const [state, dispatch] = useFormState(runVocoderWithFile, initialState);
  const blob = state.buffer
    ? new Blob([base64ToArrayBuffer(state.buffer)], { type: ".wav" })
    : undefined;
  const blobUrl = blob && URL.createObjectURL(blob);

  if (loading || authLoading) return <div>Loading</div>;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <form action={dispatch} className="">
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="flex items-center mb-4">
            <Input
              isReadOnly={!isEditingName}
              isRequired
              value={isEditingName ? runNameTemp : runName}
              onValueChange={setRunNameTemp}
              name="run-name"
              className={"max-w-xs mr-4 " + (isEditingName ? "" : "")}
              classNames={{
                inputWrapper: isEditingName ? "" : "bg-white",
                input: "text-lg",
              }}
            />
            <Button
              isIconOnly
              onClick={() => {
                const inner = async () => {
                  if (isEditingName) {
                    setRunName(runNameTemp);
                    if (runId && user) {
                      const idToken = await user.getIdToken();
                      updateRunName(runId, runNameTemp, idToken);
                      const runs = await getRuns(idToken);
                      setRuns(runs);
                    }
                  }
                  setIsEditingName((oldValue) => !oldValue);
                };
                inner();
              }}
            >
              {isEditingName ? <FaCheck /> : <FaPencil />}
            </Button>
          </div>
          {items.map((id) => {
            switch (id) {
              case 1:
                return (
                  <SortableItem key={1} id={1}>
                    <div className="my-4">
                      <ModulatorSignalInput
                        signals={modulatorSignals}
                        setSignals={setModulatorSignals}
                        onSignalAdd={(signal) =>
                          onSignalAdd(signal, "modulatorSignals")
                        }
                      />
                      <div>
                        {isSwitchOn ? (
                          <p>Input a Modulator Signal here to get started!</p>
                        ) : (
                          <p></p>
                        )}
                      </div>
                    </div>
                  </SortableItem>
                );
              case 2:
                return (
                  <SortableItem key={2} id={2}>
                    <div className="my-4">
                      <CarrierSignalInput
                        signals={carrierSignals}
                        setSignals={setCarrierSignals}
                        onSignalAdd={(signal) =>
                          onSignalAdd(signal, "carrierSignals")
                        }
                      />
                    </div>
                    <div>
                      {isSwitchOn ? (
                        <p>
                          Input a Carrier Signal here and select a synthesizer!
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </div>
                  </SortableItem>
                );
              case 3:
                return (
                  <SortableItem key={3} id={3}>
                    <div className="flex items-center my-4 justify-between">
                      <Switch name="show-steps" value="true">
                        Show steps
                      </Switch>
                      <div>
                        {isSwitchOn ? (
                          <p>
                            Now you are ready! Click run to generate your final
                            product.
                          </p>
                        ) : (
                          <p></p>
                        )}
                      </div>
                      <SubmitButton />
                      {state.error && (
                        <p className="text-red-600">{state.error}</p>
                      )}
                    </div>
                    <ShowWaveform blob={blob} blobUrl={blobUrl} />
                  </SortableItem>
                );
            }
          })}
        </SortableContext>
      </form>
    </DndContext>
  );
}
