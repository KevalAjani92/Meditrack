"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal, Eye, FileText, Printer, Download, RefreshCw } from "lucide-react";
import { Payment } from "@/types/payment";

interface Props {
  payment: Payment;
  onView: () => void;
  onViewBill: () => void;
  onPrint: () => void;
  onDownload: () => void;
  onRetry: () => void;
}

export default function PaymentActionsMenu({ payment, onView, onViewBill, onPrint, onDownload, onRetry }: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors outline-none focus:ring-2 focus:ring-primary/20">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[160px] bg-popover text-popover-foreground rounded-lg border border-border shadow-lg p-1 z-50 animate-in fade-in zoom-in-95 duration-100"
          align="end" sideOffset={5}
        >
          <DropdownMenu.Item onClick={onView} className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-md outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground">
            <Eye className="w-4 h-4" /> View Details
          </DropdownMenu.Item>
          
          <DropdownMenu.Item onClick={onViewBill} className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-md outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground">
            <FileText className="w-4 h-4" /> View Bill
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-border my-1" />

          <DropdownMenu.Item onClick={onPrint} className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-md outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground">
            <Printer className="w-4 h-4" /> Print Receipt
          </DropdownMenu.Item>

          <DropdownMenu.Item onClick={onDownload} className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-md outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground">
            <Download className="w-4 h-4" /> Download PDF
          </DropdownMenu.Item>

          {payment.status === "Failed" && (
            <>
              <DropdownMenu.Separator className="h-px bg-border my-1" />
              <DropdownMenu.Item onClick={onRetry} className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-md outline-none cursor-pointer hover:bg-muted text-primary font-medium">
                <RefreshCw className="w-4 h-4" /> Retry Payment
              </DropdownMenu.Item>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}