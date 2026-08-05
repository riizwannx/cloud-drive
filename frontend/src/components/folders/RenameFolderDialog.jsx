import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RenameFolderDialog({
  open,
  onOpenChange,
  folder,
  onSave,
}) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (folder) {
      setName(folder.name);
    }
  }, [folder]);

  const handleSave = () => {
    if (!name.trim()) {
      alert("Folder name is required.");
      return;
    }

    onSave(name.trim());
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>

        <DialogHeader>
          <DialogTitle>
            Rename Folder
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">

          <label className="text-sm font-medium">
            Folder Name
          </label>

          <Input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Enter folder name"
          />

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button onClick={handleSave}>
            Save
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}