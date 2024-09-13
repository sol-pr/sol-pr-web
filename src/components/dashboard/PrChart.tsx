import React from "react";
import Chart, { Props } from "react-apexcharts";

const state: Props["series"] = [
  {
    name: "PR",
    data: [12, 2, 3, 1, 6, 8, 7],
  },
];

var options: Props["options"] = {
  chart: {
    type: "area",
    animations: {
      easing: "linear",
      speed: 300,
    },
    sparkline: {
      enabled: false,
    },
    brush: {
      enabled: false,
    },
    id: "basic-bar",
    fontFamily: "Inter, sans-serif",
    foreColor: "#ffffffA1",
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  colors: ["#DD62ED"],
  xaxis: {
    categories: ["mon", "thu", "wed", "thu", "fri", "sat", "sun"],
  },
  tooltip: {
    enabled: false,
  },
  grid: {
    show: false,
  },
  plotOptions: {
    bar: {
      dataLabels: {
        position: "top",
      },
    },
  },
  stroke: {
    curve: "smooth",
    fill: {
      colors: ["red"],
    },
  },
  // @ts-ignore
  markers: false,
};

export const PrChart = () => {
  return (
    <div className="relative flex items-center justify-center w-full">
      <div className="flex flex-col absolute top-4 left-11 gap-2 drop-shadow-xl z-10">
        <h1 className="text-5xl font-bold text-primary-500">My pr</h1>
        <p className="text-foreground-500">This week</p>
      </div>
      <Chart
        options={options}
        series={state}
        type="area"
        height={215}
        className="w-full mr-5"
      />
    </div>
  );
};
