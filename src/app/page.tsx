import { Button, Switch } from "@nextui-org/react";
import { FaCircleInfo } from "react-icons/fa6";

export default function Home() {
  return (
    <main className="flex flex-col h-screen">
      <header className="flex justify-between p-4">
        <div className="flex items-center">
          <p className="">Learn Vocoders</p>
          {/* implement using NextUI Dropdown */}
          <Button>File</Button>
        </div>
        <div className="flex">
          <Switch
            defaultChecked={false}
            color="primary"
            endContent={<FaCircleInfo />}
          >
            Explanation mode
          </Switch>
        </div>
      </header>
      <main className="flex-grow">
        <div>carrier</div>
        <div>modulator</div>
        <div>midi notes</div>
        <div>run</div>
        <div>show steps</div>
        <div>output</div>
      </main>
      <footer className="p-4">
        <Button color="secondary" className="float-right">
          Learn More About Vocoders!
        </Button>
      </footer>
    </main>
  );
}
