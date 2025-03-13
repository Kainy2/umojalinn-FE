import EscrowNavTab from "@/section/dashboard/escrow/NavTab";
import EscrowPaidOutHero from "@/section/dashboard/escrow/PaidOutHero";
import ActiveProjectCardList from "@/section/dashboard/project/cardList/Active";
import React from "react";

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <h1 className="text-subtitle-1 font-bold mb-8">Escrow</h1>
      <EscrowNavTab />
      <EscrowPaidOutHero />
      <ActiveProjectCardList baseUrlSlug="escrow" />
      {children}
    </>
  );
};

export default Layout;
