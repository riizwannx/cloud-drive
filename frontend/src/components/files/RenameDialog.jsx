import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";

export default function RenameDialog({
  open,
  onOpenChange,
  file,
  onSave,
}) {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(file?.originalName || "");
  }, [file]);

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Rename File
          </AlertDialogTitle>
        </AlertDialogHeader>

        <Input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="Enter new file name"
        />

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={() => onSave(name)}
          >
            Save
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}