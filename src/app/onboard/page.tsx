"use client";
import { onboard } from "@/actions/user";
import { toast } from "@/hooks/use-toast";
import useHandleError from "@/hooks/useHandleError";
import Verified from "@/icons/Verified";
import { cn } from "@/lib/utils";
import { UmojaLinnUserRole } from "@/types/user";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { MouseEventHandler } from "react";

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
  {
    role: "BUYER",
    src: "lg:bg-[url('/img/webp/buyer-lg.webp')] bg-[url('/img/webp/buyer-sm.webp')]",
    href: "/onboard/buyer",
    title: "Onboard as a Buyer",
    description: "Ready to join our squad of over 16,000 verified buyers?",
    alt: "I am a Buyer",
    icon: <Verified className="text-[#0788F5]" />,
  },
  {
    role: "DESIGNER",
    src: "lg:bg-[url('/img/webp/designer-lg.webp')] bg-[url('/img/webp/designer-sm.webp')] ",
    href: "/onboard/designer",
    title: "Onboard as a Designer",
    description:
      "Ready to join our elite crew of over 16,000 verified designers?",
    alt: "I am a Designer",
    icon: <Verified className="text-primary" />,
  },
];

const OnboardPage = () => {
  const { handleError } = useHandleError("Onboarding");
  const router = useRouter();
  const { update } = useSession();

  const handleClick =
    (
      role: UmojaLinnUserRole,
      redirect: string
    ): MouseEventHandler<HTMLButtonElement> =>
    async (e) => {
      e.preventDefault();
      toast({
        description: "Please wait!",
      });
      try {
        await onboard(role);
        update({ role });
        router.push(redirect);
      } catch (error) {
        handleError(error);
      }
    };

  return (
    <div className="bg-[url('/img/png/pattern.png')] bg-cover h-screen w-screen relative flex items-stretch justify-stretch flex-col lg:flex-row">
      {onboardButtonsProps.map((props) => (
        <span
          key={props.href}
          onClick={handleClick(props.role, props.href)}
          // href={props.href}
          className={cn(
            "flex-1 cursor-pointer bg-cover bg-left-top group relative before:content-[''] before:absolute before:top-0 before:h-full before:w-full before:bg-gradient-to-t before:from-black before:to-transparent overflow-hidden",
            props.src
          )}
        >
          <div className="text-white absolute bottom-0 p-8 lg:p-20  opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300">
            <h2 className="text-lg md:text-xl font-semibold mb-2">
              {props.title}
            </h2>
            <div className="flex  gap-1 max-w-md items-center ">
              <p className="flex-1">{props.description}</p> {props.icon}
            </div>
          </div>
          <div className="absolute top-0 h-full w-full hidden lg:block lg:opacity-100 lg:group-hover:opacity-0 transition-all duration-300 bg-gradient-to-t from-black/50 to-black/20">
            <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 text-xl font-semibold text-center text-gray-400 whitespace-nowrap">
              {props.alt}
            </h2>
          </div>
        </span>
      ))}
    </div>
  );
};

export default OnboardPage;
