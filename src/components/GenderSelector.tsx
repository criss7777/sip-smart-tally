
import React, { useEffect } from "react";
import { GenderDialog } from "./GenderDialog";

interface GenderSelectorProps {
  gender: "male" | "female" | null;
  setGender: (gender: "male" | "female") => void;
}

export const GenderSelector: React.FC<GenderSelectorProps> = ({ gender, setGender }) => {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("gender");
    if (saved === "male" || saved === "female") {
      setGender(saved);
    } else {
      setOpen(true);
    }
    // eslint-disable-next-line
  }, []);

  const handleSelectGender = (selected: "male" | "female") => {
    setGender(selected);
    localStorage.setItem("gender", selected);
    setOpen(false);
  };

  return (
    <GenderDialog open={open} onSelect={handleSelectGender} />
  );
};
