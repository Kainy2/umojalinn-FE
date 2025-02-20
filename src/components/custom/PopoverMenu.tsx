import { PopoverClose, PopoverProps } from "@radix-ui/react-popover";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import MenuButton, { MenuButtonProps } from "./MenuButton";

type PopoverMenuProps = PopoverProps & {
  menus: Array<MenuButtonProps>;
};

const PopoverMenu = (props: PopoverMenuProps) => {
  const { children, menus, ...popoverProps } = props;
  return (
    <Popover {...popoverProps}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-0">
        {menus?.map?.((menu, index) => (
          <PopoverClose asChild key={index}>
            <MenuButton {...menu} />
          </PopoverClose>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default PopoverMenu;
