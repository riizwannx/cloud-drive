import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Upload,
  FolderPlus,
  Share2,
  Trash2,
} from "lucide-react";

const actions = [
  {
    title: "Upload File",
    icon: Upload,
  },
  {
    title: "New Folder",
    icon: FolderPlus,
  },
  {
    title: "Share File",
    icon: Share2,
  },
  {
    title: "Trash",
    icon: Trash2,
  },
];

export default function QuickActions() {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Button
              key={action.title}
              variant="outline"
              className="h-24 flex-col gap-3 rounded-xl"
            >
              <Icon className="h-6 w-6" />
              <span>{action.title}</span>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}