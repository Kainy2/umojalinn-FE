import { CustomSidebarMenuItemProps } from "@/components/custom/sidebar/MenuItem";
import Activity from "@/icons/Activity";
import Bank from "@/icons/Bank";
import Grid01 from "@/icons/Grid01";
// import MessageSquare02 from "@/icons/MessageSquare02";
import SearchRefracted from "@/icons/SearchRefracted";
import Settings01 from "@/icons/Settings01";
import Tag03 from "@/icons/Tag03";
import Wallet02 from "@/icons/Wallet02";

import React from "react";

export const BUYERS_SIDEBAR_CONTENT: CustomSidebarMenuItemProps[] = [
  {
    title: "Projects",
    url: "/projects",
    icon: <Activity />,
    regex: /(^\/$|^\/project\/.*|^\/projects$|^\/projects\/.*|^\/bids\/.*)/,
  },
  // {
  //   title: "Designers",
  //   url: "#",
  //   icon: <SearchRefracted />,
  // },
  {
    title: "Sizing Templates",
    url: "/sizing-templates",
    icon: <Tag03 />,
    regex:
      /^\/(sizing-templates$|sizing-templates\/in-use$|sizing-templates\/drafts$)/,
  },
  // {
  //   title: "Messages",
  //   url: "#",
  //   icon: <MessageSquare02 />,
  // },
  // {
  //   title: "Wallet",
  //   url: "#",
  //   icon: <Wallet02 />,
  // },
  {
    title: "Escrow",
    url: "/escrow",
    icon: <Bank />,
    regex: /^\/(escrow$|escrow\/.*)/,
  },
  {
    isAd: true,
    title: "Got any feedback in mind?",
    description:
      "We're in beta and value your feedback to enhance  your experience",
    img: "/img/webp/customer-care.webp",
    action: {
      title: "Submit feedback",
      href: "https://tally.so/r/w2Dz2g",
    },
  },
  {
    title: "Settings",
    url: "/settings",
    icon: <Settings01 />,
    regex: /^\/(settings$|settings\/.*)/,
  },
];

export const DESIGNERS_SIDEBAR_CONTENT: CustomSidebarMenuItemProps[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <Grid01 />,
    regex:
      /(^\/$|^\/dashboard|^\/dashboard\/.*|^\/bids$|^\/bids\/.*|^\/active-jobs$|^\/active-jobs\/.*)/,
  },
  {
    title: "Jobs",
    url: "/jobs",
    icon: <SearchRefracted />,
    regex: /(^\/jobs$|^\/jobs\/.*)/,
  },
  {
    title: "Sizing Templates",
    url: "/sizing-templates",
    icon: <Tag03 />,
    regex: /^\/(sizing-templates$)/,
  },
  // {
  //   title: "Messages",
  //   url: "#",
  //   icon: <MessageSquare02 />,
  // },
  {
    title: "Wallet",
    url: "/wallet",
    icon: <Wallet02 />,
    regex: /(^\/wallet$|^\/wallet\/.*)/,
  },
  {
    title: "Escrow",
    url: "/escrow",
    icon: <Bank />,
    regex: /^\/(escrow$|escrow\/.*)/,
  },
  {
    isAd: true,
    title: "Got any feedback in mind?",
    description:
      "We're in beta and value your feedback to enhance  your experience",
    img: "/img/webp/customer-care.webp",
    action: {
      title: "Submit feedback",
      href: "https://tally.so/r/w2Dz2g",
    },
  },
  {
    title: "Settings",
    url: "/settings",
    icon: <Settings01 />,
    regex: /^\/(settings$|settings\/.*)/,
  },
];
