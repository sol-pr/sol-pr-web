import { Info } from "lucide-react";
import React from "react";

const LastNotification = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <Info className="text-primary-500" size={50} />
      <div className="flex flex-col gap-2 ml-4">
        <h1 className="text-primary-500 font-bold text-2xl">
          Last Notification
        </h1>
        <p className="text-foreground-400">You have 3 unread notifications</p>
      </div>
    </div>
  );
};

export default LastNotification;
