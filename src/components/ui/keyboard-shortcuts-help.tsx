import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { KeyboardIcon } from "lucide-react";
import { useShortcutHelp } from "@/hooks/use-keyboard-shortcuts";

interface KeyboardShortcutsHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KeyboardShortcutsHelp({
  open,
  onOpenChange,
}: KeyboardShortcutsHelpProps) {
  const shortcuts = useShortcutHelp();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyboardIcon className="h-5 w-5" />
            Atajos de Teclado
          </DialogTitle>
          <DialogDescription>
            Usa estos atajos para controlar el torneo más rápidamente
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-96 space-y-3 overflow-y-auto">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 py-2"
            >
              <span className="flex-1 text-sm text-slate-600 dark:text-slate-400">
                {shortcut.description}
              </span>
              <Badge
                variant="outline"
                className="bg-slate-100 px-2 py-1 font-mono text-xs dark:bg-slate-800"
              >
                {shortcut.key}
              </Badge>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            💡 <strong>Tip:</strong> Los atajos no funcionan cuando estás
            escribiendo en campos de texto.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
