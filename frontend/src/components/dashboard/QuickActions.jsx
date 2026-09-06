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
    <Card className="surface-card rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg tracking-[-0.02em]">Quick actions</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Button
              key={action.title}
              variant="outline"
              className="h-24 flex-col gap-2 rounded-xl border-border/80 bg-background/40 text-xs font-medium shadow-none hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:border-indigo-400/30 dark:hover:bg-indigo-400/10 dark:hover:text-indigo-300"
            >
              <Icon className="h-5 w-5" />
              <span>{action.title}</span>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
