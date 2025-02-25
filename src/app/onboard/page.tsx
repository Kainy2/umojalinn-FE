"use server";
import Verified from "@/icons/Verified";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { UmojaLinnUserRole } from "@/types/user";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type OnboardButtonProps = {
  role: UmojaLinnUserRole;
  src: string;
  href: string;
  title: string;
  description: string;
  alt: string;
  icon: React.JSX.Element;
};

const onboardButtonsProps: OnboardButtonProps[] = [
  // {
  //   role: "BUYER",
  //   src: "lg:bg-[url('/img/webp/buyer-lg.webp')] bg-[url('/img/webp/buyer-sm.webp')]",
  //   href: "/onboard/buyer",
  //   title: "Onboard as a Buyer",
  //   description: "Ready to join our squad of over 16,000 verified buyers?",
  //   alt: "I am a Buyer",
  //   icon: <Verified className="text-[#0788F5]" />,
  // },
  {
    role: "DESIGNER",
    src: "lg:bg-[url('/img/webp/designer-lg.webp')] bg-[url('/img/webp/designer-sm.webp')] ",
    href: "/onboard/designer",
    title: "Onboard as a Designer",
    description:
      "Ready to join our elite crew of over 16,000 verified designers? Click on the screen to continue.",
    alt: "I am a Designer",
    icon: <Verified className="text-primary" />,
  },
];

const OnboardPage = async () => {
  const session = await auth();

  if (session?.user?.profileRole) {
    redirect("/");
  }

  return (
    <div className="bg-[url('/img/png/pattern.png')] bg-cover h-screen w-screen relative flex items-stretch justify-stretch flex-col lg:flex-row">
      {onboardButtonsProps.map((props) => (
        <Link
          key={props.href}
          href={props.href}
          className={cn(
            "flex-1 cursor-pointer bg-cover bg-left-top group relative before:content-[''] before:absolute before:top-0 before:h-full before:w-full before:bg-gradient-to-t before:from-black before:to-transparent overflow-hidden",
            props.src
          )}
        >
          <div className="text-white absolute bottom-0 p-8 lg:p-20  opacity-100 dev:lg:opacity-0 dev:group-hover:opacity-100 dev:transition-all dev:duration-300">
            <h2 className="text-lg md:text-xl font-semibold mb-2">
              {props.title}
            </h2>
            <div className="flex  gap-1 max-w-md items-center ">
              <p className="flex-1">{props.description}</p> {props.icon}
            </div>
          </div>
          {/* <div className="absolute top-0 h-full w-full hidden lg:block lg:opacity-100 lg:group-hover:opacity-0 transition-all duration-300 bg-gradient-to-t from-black/50 to-black/20">
            <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 text-xl font-semibold text-center text-gray-400 whitespace-nowrap">
              {props.alt}
            </h2>
          </div> */}
        </Link>
      ))}
    </div>
  );
};

export default OnboardPage;
