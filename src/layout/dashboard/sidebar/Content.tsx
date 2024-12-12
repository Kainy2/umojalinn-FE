import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Activity from "@/icons/Activity";
import Bank from "@/icons/Bank";
import MessageSquare02 from "@/icons/MessageSquare02";
import SearchRefracted from "@/icons/SearchRefracted";
import Settings01 from "@/icons/Settings01";
import Tag03 from "@/icons/Tag03";
import Wallet02 from "@/icons/Wallet02";
import Image from "next/image";
import Link from "next/link";

import React from "react";

const items = [
  {
    title: "Projects",
    url: "/",
    icon: Activity,
  },
  {
    title: "Designers",
    url: "#",
    icon: SearchRefracted,
  },
  {
    title: "Sizing Templates",
    url: "#",
    icon: Tag03,
  },
  {
    title: "Messages",
    url: "#",
    icon: MessageSquare02,
  },
  {
    title: "Wallet",
    url: "#",
    icon: Wallet02,
  },
  {
    title: "Escrow",
    url: "#",
    icon: Bank,
  },
  {
    isAd: true,
    title: "Got any feedback in mind?",
    description:
      "We're in beta and value your feedback to enhance  yourr experience",
    img: "/img/webp/customer-care.webp",
    action: {
      title: "Submit feedback",
      href: "/",
    },
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings01,
  },
];

const DashboardSidebarContent = () => {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => {
              if (item.isAd) {
                return (
                  <div
                    key={item.title}
                    className="bg-gray-50 px-2 py-6 my-2 block"
                  >
                    <h4 className="font-semibold leading-normal">
                      {item.title}
                    </h4>
                    <p className="leading-normal mb-4">{item.description}</p>
                    <Image
                      alt={item.title}
                      src={item.img}
                      height={172.72}
                      width={216}
                      className="h-32 w-full object-cover rounded-md mb-6"
                    />
                    <Link href={item.action?.href}>{item.action?.title}</Link>
                  </div>
                );
              }

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      {item.icon && <item.icon />}
                      <span className="flex-1">{item.title}</span>
                      <span className="shrink-0 h-5  w-5 text-xs flex items-center justify-center bg-gray-200 rounded-full">
                        12
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};

export default DashboardSidebarContent;
