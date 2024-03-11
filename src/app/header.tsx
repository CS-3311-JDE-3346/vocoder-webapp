import {
  Button,
  Switch,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { FaCircleInfo } from "react-icons/fa6";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { app } from "../../firebase/firebaseApp";
import React, { useState } from "react";

export default function Header() {
  app;
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const [user, loading] = useAuthState(auth);
  const u = auth.currentUser;

  const signIn = async () => {
    const result = await signInWithPopup(auth, provider);
  };

  const SignStat = () => {
    if (user) {
      return (
        <Button
          onClick={() => auth.signOut()}
          className="bg-blue-700 text-slate-300"
        >
          Sign Out
        </Button>
      );
    } else {
      return (
        <Button onClick={signIn} className="bg-blue-700 text-slate-300">
          Sign In
        </Button>
      );
    }
  };

  const [EducationRelation, setValue] = useState("Not a Teacher or Student");

  const UserSettingActive = () => {
    if (user) {
      return (
        <Popover placement="bottom">
          <PopoverTrigger>
            <Button className="bg-blue-700 text-slate-300">User Profile</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <p>User Profile</p>
              <div>____________________________________</div>
              <Select
                label="Education relation"
                placeholder={EducationRelation}
                onSelectionChange={setValue}
              >
                <SelectItem
                  key={"Not a Teacher or Student"}
                  value={"Not a Teacher or Student"}
                >
                  Not a Teacher or Student
                </SelectItem>
                <SelectItem key={"Teacher"} value={"Teacher"}>
                  Teacher
                </SelectItem>
                <SelectItem key={"Student"} value={"Student"}>
                  Student
                </SelectItem>
              </Select>
            </div>
          </PopoverContent>
        </Popover>
      );
    } else {
      return null;
    }
  };

  return (
    <header className="flex justify-between p-4 bg-blue-300 drop-shadow">
      <div className="flex items-center">
        <p className="mr-8 font-bold text-slate-800">Learn Vocoders</p>
        {/* implement using NextUI Dropdown */}
        <Button className="bg-blue-700 text-slate-300">File</Button>
      </div>
      <div className="flex">
        <UserSettingActive /> &nbsp;&nbsp;
        <SignStat /> &nbsp;&nbsp;
        <Switch
          defaultChecked={false}
          color="primary"
          endContent={<FaCircleInfo />}
        >
          Explanation mode
        </Switch>
      </div>
    </header>
  );
}
