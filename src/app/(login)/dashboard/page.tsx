"use client";
import { GitGubServices } from "@/services/GithubServices";

import React, { useState } from "react";

const Dashboard = () => {
  const [state, setState] = useState(null as any);
  const gitgub = new GitGubServices();

  React.useEffect(() => {
    gitgub.getRepos().then((data) => {
      setState(data);
    });
  }, []);

  return (
    <section className="flex flex-col justify-center items-center h-screen">
      Dashboard
      <div>
        {state &&
          state.map((repo: any) => (
            <div key={repo.id} className="flex justify-between gap-5">
              <h1 className="font-bold">{repo.name}</h1>
              <p>{repo.description}</p>
            </div>
          ))}
      </div>
    </section>
  );
};
export default Dashboard;
