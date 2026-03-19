"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, Copy, Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  password: string;
  title?: string;
  description?: string;
}

export default function PasswordModal({
  isOpen,
  onClose,
  password,
  title = "Password Generated",
  description = "Please save this password securely. It will not be shown again.",
}: PasswordModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[60] animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[60] w-full max-w-sm translate-x-[-50%] translate-y-[-50%] rounded-xl bg-card p-6 shadow-lg border border-border animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-success" />
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <p className="text-sm text-muted-foreground mb-4">{description}</p>

          <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border">
            <code className="flex-1 text-sm font-mono font-bold text-foreground tracking-wider select-all">
              {password}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="shrink-0 h-8 w-8 p-0"
            >
              {copied ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={onClose}>Done</Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
