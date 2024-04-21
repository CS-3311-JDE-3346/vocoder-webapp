import React, { useState, useEffect } from "react";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Select,
  SelectItem,
} from "@nextui-org/react"; // Assuming you're using Chakra UI components
import {getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import {useAuthState} from "react-firebase-hooks/auth"
import { doc, getDoc, collection , addDoc, getFirestore, initializeFirestore } from "firebase/firestore";
import { app, db } from "../../../firebase/firebaseApp"

const UserSettingActive = ({ user }) => {
  
  const [EducationRelation, setUserData] = useState("Not a Teacher or Student");
  //const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    }
  }

  /*useEffect(() => {
    fetchUserData();
  }, [user])*/

  const handleSubmit = async() => {
    try {
      await addDoc(collection(db, "userInputs"), {
        userId: user.uid,
        value: userData,
      });
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  if (user) {
    return (
      <Popover placement="bottom">
        <PopoverTrigger>
          <Button className="bg-blue-700 text-slate-300">User Profile</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="px-1 py-2">
            <p>User Profile</p>
            <div style={{ color: '#FFFFFF' }}>____________________________________</div>
            <Select
              label="Education relation"
              defaultSelectedKeys={[EducationRelation]}
              onSelectionChange={handleSubmit}
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

export default UserSettingActive;
