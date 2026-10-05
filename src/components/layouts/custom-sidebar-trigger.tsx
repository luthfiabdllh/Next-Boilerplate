"use client";

import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CustomSidebarTriggerProps {
  label?: string;
}

export function CustomSidebarTrigger({
  label = "Toggle Sidebar",
}: CustomSidebarTriggerProps) {
  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>
        <SidebarTrigger />
      </TooltipTrigger>
      <TooltipContent className="flex items-center gap-2 px-2 py-1" side="right">
        <span>{label}</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>b</Kbd>
        </KbdGroup>
      </TooltipContent>
    </Tooltip>
  );
}
