"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface LatestChangeProps {
  badge?: string;
  title?: string;
  description?: string;
  readMoreLabel?: string;
  readMoreHref?: string;
  className?: string;
}

export function LatestChange({
  badge = "UPDATE",
  title = "Next.js 16 Template",
  description = "App shell with RBAC & themes.",
  readMoreLabel = "Changelog",
  readMoreHref = "#",
  className,
}: LatestChangeProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-lg group/latest-change size-full min-h-24 justify-center border border-sidebar-border bg-sidebar-accent/50 text-sidebar-foreground",
        "relative flex size-full flex-col gap-1 overflow-hidden p-3 *:text-nowrap",
        "transition-all duration-300 ease-in-out group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:max-h-0 group-data-[collapsible=icon]:min-h-0 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:m-0 group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:scale-95",
        className
      )}
    >
      <span className="font-light font-mono text-[10px] text-muted-foreground">
        {badge}
      </span>
      <p className="font-medium text-xs truncate">{title}</p>
      <span className="text-[10px] text-muted-foreground truncate">
        {description}
      </span>
      <Button
        asChild
        className="w-max px-0 font-light text-xs h-auto py-1 text-primary hover:underline"
        size="sm"
        variant="link"
      >
        <a href={readMoreHref}>{readMoreLabel}</a>
      </Button>
      <Button
        className="absolute top-2 right-2 z-10 size-5 rounded-full p-0 opacity-0 transition-opacity group-hover/latest-change:opacity-100 text-muted-foreground hover:text-foreground"
        onClick={() => setIsOpen(false)}
        size="icon"
        variant="ghost"
        aria-label="Dismiss update"
      >
        <X className="size-3" />
      </Button>
    </div>
  );
}
