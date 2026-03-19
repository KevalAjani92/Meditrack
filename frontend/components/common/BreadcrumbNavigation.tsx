"use client";

import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BreadcrumbItem {
  idx:number;
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
  backHref?: string;
}

export default function BreadcrumbNavigation({ items, backHref }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 text-sm">
      {backHref && (
        <Link href={backHref}>
          <Button variant="outline" size="sm" className="gap-2 h-8">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Button>
        </Link>
      )}
      <nav className="flex items-center flex-wrap gap-1.5 text-muted-foreground">
        {items.map((item, index) => (
          <div key={item.idx} className="flex items-center gap-1.5">
            {item.href ? (
              <Link href={item.href} className="hover:text-foreground hover:underline transition-colors font-medium">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-semibold">{item.label}</span>
            )}
            {index < items.length - 1 && <ChevronRight className="w-4 h-4 opacity-50" />}
          </div>
        ))}
      </nav>
    </div>
  );
}