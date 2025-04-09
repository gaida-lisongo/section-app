"use client";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import type { Promotion } from '@/types/promotion';

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type ChartData = {
  categories: string[];
  series: {
    name: string;
    data: number[];
  }[];
};

interface Props {
  promotions: Promotion[];
}

export function UnitDistributionChart({ promotions }: Props) {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 2,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [], // Adjust this based on promotions data
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: "Nombre d'unités",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} unités`,
      },
    },
    colors: ["#3C50E0"],
    grid: {
      show: true,
      borderColor: "#E2E8F0",
      strokeDashArray: 10,
      position: "back",
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          xaxis: {
            labels: {
              rotate: -45,
              rotateAlways: true,
            },
          },
        },
      },
    ],
  };

  return (
    <div className="h-[350px]">
      <ReactApexChart
        options={options}
        series={[]} // Adjust this based on promotions data
        type="bar"
        height="100%"
      />
    </div>
  );
}