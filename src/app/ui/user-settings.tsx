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
  
  let educationRelationOptions = [
    {label: "Not a Teacher or Student", value: "0"},
    {label: "Teacher", value: "1"},
    {label: "Student", value: "2"},
  ]

  const [EducationRelation, setUserData] = useState(new Set([educationRelationOptions[0]['value']]));
  //const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(new Set(["0"])  /*userDoc.data()*/);
        }
      } catch (error) {
        console.error("Error getting data:", error);
      }
    }
  }

  useEffect(() => {
    fetchUserData();
  }, [user])

  const handleSubmit = async(e) => {
    try {
      await addDoc(collection(db, "userInputs"), {
        userId: user.uid,
        value: e.target.value,
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
              items = {educationRelationOptions}
              defaultSelectedKeys={EducationRelation}
              onChange={handleSubmit}
            >
              {
                (educationRelationOptions) => <SelectItem key = {educationRelationOptions.value} value = {educationRelationOptions.value}>
                  {}
                  {educationRelationOptions.label}
                </SelectItem>
              }
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
