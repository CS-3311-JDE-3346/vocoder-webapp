import React, { useState } from "react";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Select,
  SelectItem,
} from "@nextui-org/react"; // Assuming you're using Chakra UI components

const UserSettingActive = ({ user }) => {
  const [EducationRelation, setValue] = useState("Not a Teacher or Student");

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

export default UserSettingActive;
