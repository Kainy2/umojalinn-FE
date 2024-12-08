"use client";
import useWindowSize from "@/hooks/useWindowSize";
import Image from "next/image";
import React from "react";
import Confetti from "react-confetti";

const CongratulationsPage = () => {
  const { height, width } = useWindowSize();
  return (
    <div className="bg-auth">
      <Confetti
        width={width}
        height={height}
        colors={["#FDE272", "#FAC515", "#EAAA08", "#CA8504"]}
        run={true}
      />
      <div className="container text-center flex flex-col items-center">
        <h1 className="text-xl font-bold text-foreground mb-2 ">
          Congratulations
        </h1>
        <p>
          We&apos;re thrilled to have you on board! Please hold on for a moment
          as we tidy up your dashboard
        </p>

        <Image
          src="/img/svg/running_man.svg"
          height={400}
          width={400}
          alt=""
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default CongratulationsPage;
