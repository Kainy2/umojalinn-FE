"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const router = useRouter();
  return (
    <Button variant="ghost" onClick={() => router.back()} type="button">
      <ArrowLeft className="size-4" /> Back
    </Button>
  );
};

export default BackButton;
