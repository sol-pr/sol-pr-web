"use client";
import { BlinksService } from "@/services/BlinksService";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type BlinkData = {
  icon: string;
  title: string;
  description: string;
  links: {
    actions: {
      label: string;
      href: string;
    }[];
  };
};

const Page = () => {
  const [blinkdata, setBlinkdata] = useState<BlinkData>();
  const blinkService = new BlinksService();
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://sol-pr-web.vercel.app/api/donate");
      const data: BlinkData = await response.json();
      setBlinkdata(data);
    };

    fetchData();
  }, []);

  if (!blinkdata) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <p>Loading...</p>
      </div>
    );
  }

  function handleClick(url: string) {
    blinkService.postRequest(url);
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className=" p-6 rounded-lg shadow-lg text-center">
        <CardHeader>
          <Image
            src={blinkdata.icon}
            width={300}
            height={300}
            className="rounded-md"
            alt="jpg"
          />
        </CardHeader>
        <CardBody>
          <h2 className="text-2xl font-semibold mb-2">{blinkdata.title}</h2>
          <p className="text-gray-600 mb-4">{blinkdata.description}</p>
        </CardBody>
        <CardFooter>
          <Button
            onClick={() => {
              handleClick(blinkdata.links.actions[0].href);
            }}
            color="primary"
            className="w-full"
          >
            {blinkdata.links.actions[0].label}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
