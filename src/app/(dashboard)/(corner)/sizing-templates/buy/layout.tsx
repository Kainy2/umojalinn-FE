import { Slash, Tag } from "lucide-react";
import React from "react";
import Link from "next/link";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="">
            <div className="flex items-center gap-4 [&>svg]:size-4 text-foreground-body mb-10">
                <Tag className="text-gray-500" />
                <Slash className="text-gray-300" />
                <Link href="/sizing-templates">Sizing Templates</Link>
                <Slash className="text-gray-300" />
                <p className="font-semibold px-2 py-1 rounded-md">Buy Templates</p>
            </div>
            {children}
        </div>
    );
};

export default Layout;
