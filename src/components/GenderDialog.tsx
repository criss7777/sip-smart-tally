
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { MaleSign, FemaleSign } from "lucide-react";

interface GenderDialogProps {
  open: boolean;
  onSelect: (gender: "male" | "female") => void;
}

export const GenderDialog: React.FC<GenderDialogProps> = ({ open, onSelect }) => {
  const [value, setValue] = React.useState<"male" | "female" | "">("");

  useEffect(() => {
    if (open) setValue("");
  }, [open]);

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-xs py-8">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg text-center">Choose Your Gender</DialogTitle>
        </DialogHeader>
        <RadioGroup
          className="flex flex-col gap-4"
          value={value}
          onValueChange={v => setValue(v as "male" | "female")}
        >
          <label className="flex items-center gap-3 rounded-lg border px-4 py-2 cursor-pointer hover:bg-primary-100">
            <RadioGroupItem value="male" id="male"/>
            <MaleSign className="text-blue-600" />
            <span>Male</span>
          </label>
          <label className="flex items-center gap-3 rounded-lg border px-4 py-2 cursor-pointer hover:bg-primary-100">
            <RadioGroupItem value="female" id="female" />
            <FemaleSign className="text-pink-500" />
            <span>Female</span>
          </label>
        </RadioGroup>
        <Button
          disabled={!value}
          className="mt-6 w-full"
          onClick={() => value && onSelect(value)}
        >
          Confirm
        </Button>
      </DialogContent>
    </Dialog>
  );
};
