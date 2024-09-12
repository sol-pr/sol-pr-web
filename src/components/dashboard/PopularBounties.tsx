import { Card, CardBody } from "@nextui-org/card";
import { Tab, Tabs } from "@nextui-org/tabs";
import React from "react";
import MostPopularBounties from "./MostPopularBounties";

const PopularBounties = () => {
  return (
    <div className="flex w-full flex-col p-4">
      <Tabs
        aria-label="Options"
        className="overflow-x-auto scroll-smooth scrollbar-default"
      >
        <Tab key="photos" title="Most Popular Bounties">
          <MostPopularBounties />
        </Tab>
        <Tab key="music" title="Recent Submitted">
          <Card>
            <CardBody>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </CardBody>
          </Card>
        </Tab>
        <Tab key="videos" title="New Bounties">
          <Card>
            <CardBody>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default PopularBounties;
