import React from "react";

type Props = {
  title: string;
  description: string | undefined;
};

export const Title = (props: Props) => {
  return (
    <div className="flex-col self-start gap-6sd pt-20 sm:pt-10">
      <h1 className="text-5xl font-bold">{props.title}</h1>
      <p className="text-gray-400 font-mono mt-4">{props.description}</p>
    </div>
  );
};
