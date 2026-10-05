import Link from "next/link";
import {
  PackagePlus,
  Package,
  Settings,
  Download,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

const actions = [
  {
    title: "Add product",
    description: "Create a new SKU.",
    href: "#",
    icon: <PackagePlus className="size-4 text-foreground" />,
  },
  {
    title: "Review unfulfilled",
    description: "Orders waiting to ship.",
    href: "#",
    icon: <Package className="size-4 text-foreground" />,
  },
  {
    title: "Store settings",
    description: "Payments, checkouts...",
    href: "#",
    icon: <Settings className="size-4 text-foreground" />,
  },
  {
    title: "Export sales",
    description: "CSV for accountings.",
    href: "#",
    icon: <Download className="size-4 text-foreground" />,
  },
];

export function QuickActions() {
  return (
    <Card className="bg-card border-border/70 shadow-xs flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Quick actions</CardTitle>
        <CardDescription className="text-xs">
          Shortcuts to same destinations.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-1">
        <ItemGroup className="gap-1">
          {actions.map((a) => (
            <Item
              asChild
              key={a.title}
              size="sm"
              className="hover:bg-muted/40 rounded-lg transition-colors p-2.5"
            >
              <Link href={a.href} className="flex items-center w-full">
                <ItemMedia variant="icon" className="bg-transparent border-0 size-6 shrink-0">
                  {a.icon}
                </ItemMedia>
                <ItemContent className="ml-2 min-w-0">
                  <ItemTitle className="text-xs font-semibold text-foreground truncate">
                    {a.title}
                  </ItemTitle>
                  <ItemDescription className="text-[11px] text-muted-foreground truncate">
                    {a.description}
                  </ItemDescription>
                </ItemContent>
                <ItemActions className="ml-auto pl-2">
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </ItemActions>
              </Link>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
