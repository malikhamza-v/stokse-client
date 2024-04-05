import { useEffect, useRef, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

function BarChart({ data }: { data: { label: string[]; data: number[] } }) {
  const chart = useRef<any>();
  const [chartData, setChartData] = useState<any>({
    series: [],
    options: {
      chart: {
        width: 380,
        type: 'pie',
      },
      dataLabels: {
        enabled: true,
        formatter: (
          _: any,
          {
            seriesIndex,
            w,
          }: {
            seriesIndex: number;
            w: { config: { series: string[] } };
          },
        ) => {
          return `${w.config.series[seriesIndex]} $`;
        },
        dropShadow: {
          enabled: false,
          top: 1,
          left: 1,
          blur: 1,
          color: '#000',
          opacity: 0.45,
        },
      },
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
  });

  const handleDownload = async () => {
    if (chart.current) {
      const base64 = await chart.current.chart.dataURI();
      const downloadLink = document.createElement('a');
      downloadLink.href = base64.imgURI;
      downloadLink.download = 'image.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  useEffect(() => {
    if (data.data.length > 0) {
      setChartData({
        ...chartData,
        series: data.data,
        options: {
          ...chartData.options,
          labels: data.label,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="p-4 relative">
      {chartData.series.length > 0 && (
        <>
          <button
            type="button"
            className="absolute bottom-0 text-sm font-medium  right-0 bg-amber-200 px-4 py-1 rounded-lg z-30"
            onClick={handleDownload}
          >
            Download
          </button>
          <ReactApexChart
            ref={chart}
            options={chartData.options}
            series={chartData.series}
            type="pie"
            width={480}
          />
        </>
      )}
    </div>
  );
}

export default BarChart;
