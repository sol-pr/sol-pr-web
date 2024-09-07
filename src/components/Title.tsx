import React from "react";

type Props = {
  title: string;
  description: string;
};

export const Title = (props: Props) => {
  return (
    <div className="flex-col self-start gap-2 {">
      <h1 className="text-3xl font-bold">{props.title}</h1>
      <p className="text-gray-400">{props.description}</p>
    </div>
  );
};
