"use client";

import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useCallback, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

interface NavMainProps {
  items: NavItem[];
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  // Function to check if a route is currently active
  const isRouteActive = useCallback(
    (routePath: string): boolean => {
      return pathname === routePath;
    },
    [pathname]
  );

  // Function to check if an item has any active subitems
  const hasActiveSubItem = useCallback(
    (item: NavItem): boolean => {
      if (!item.items || item.items.length === 0) return false;
      return item.items.some((subItem) => isRouteActive(subItem.url));
    },
    [isRouteActive]
  );

  // Auto-expand items that have active subitems
  useEffect(() => {
    const newOpenItems: Record<string, boolean> = { ...openItems };
    let hasChanges = false;

    items.forEach((item) => {
      const shouldBeOpen = hasActiveSubItem(item) || isRouteActive(item.url);
      if (shouldBeOpen && !newOpenItems[item.title]) {
        newOpenItems[item.title] = true;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setOpenItems(newOpenItems);
    }
  }, [items, hasActiveSubItem, isRouteActive, openItems]);

  // Handle collapsible click
  const handleCollapsibleClick = useCallback((title: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  }, []);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0;

          // Render direct link if no subitems
          if (!hasSubItems) {
            const isActive = isRouteActive(item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <a href={item.url}>
                    {item.icon && <item.icon />}
                    <span
                      className={cn(
                        "transition-colors",
                        isActive && "text-primary font-medium"
                      )}
                    >
                      {item.title}
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          // Render collapsible dropdown
          const isOpen = openItems[item.title] || item.isActive;
          const itemIsActive = isRouteActive(item.url);
          const hasActiveSub = hasActiveSubItem(item);
          const shouldHighlight = itemIsActive && !hasActiveSub;

          return (
            <Collapsible
              key={item.title}
              asChild
              open={isOpen}
              onOpenChange={() => handleCollapsibleClick(item.title)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span
                      className={cn(
                        "transition-colors",
                        shouldHighlight && "text-primary font-medium"
                      )}
                    >
                      {item.title}
                    </span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const subIsActive = isRouteActive(subItem.url);
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span
                                className={cn(
                                  "transition-colors",
                                  subIsActive && "text-primary font-medium"
                                )}
                              >
                                {subItem.title}
                              </span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
