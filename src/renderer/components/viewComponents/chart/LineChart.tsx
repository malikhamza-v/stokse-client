import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

function LineChart({ data }: { data: any }) {
  const [series, setSeries] = useState<any>([]);

  const [options, setOptions] = useState<any>(null);

  // [info]: lifecycle
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    function formatDate(date: Date) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(
        date,
      );
      return `${day} ${month}`;
    }

    function getDatesOfMonth(year: number, month: number) {
      const dates = [];
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      for (
        let date = firstDay;
        date <= lastDay;
        date.setDate(date.getDate() + 1)
      ) {
        dates.push(formatDate(date));
      }

      return dates;
    }

    const currentMonthDates = getDatesOfMonth(currentYear, currentMonth);
    setOptions({
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [5, 7, 5],
        curve: 'straight',
        dashArray: [0, 8, 5],
      },
      title: {
        text: 'Overall Stats',
        align: 'left',
      },
      legend: {
        tooltipHoverFormatter: (val: string, opts: any) => {
          return `${val} - <strong> ${
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex]
          } </strong>`;
        },
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6,
        },
      },
      xaxis: {
        categories: currentMonthDates,
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: (val: string) => {
                return `${val} ($)`;
              },
            },
          },
          {
            title: {
              formatter: (val: string) => {
                return val;
              },
            },
          },
          {
            title: {
              formatter: (val: string) => {
                return val;
              },
            },
          },
        ],
      },
      grid: {
        borderColor: '#f1f1f1',
      },
    });

    setSeries([
      {
        name: 'Total Sales',
        data: data.total_sales,
      },
      {
        name: 'No. Of Customers',
        data: data.no_of_customers,
      },
      {
        name: 'Sale Volumn',
        data: data.sale_volumn,
      },
    ]);
  }, [data]);

  return (
    <div>
      {options && (
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={350}
        />
      )}
    </div>
  );
}

export default LineChart;
