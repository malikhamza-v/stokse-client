import { useEffect, useRef, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ErrorSVG } from '../../../utils/svg';

function BarChart({
  data,
  loading,
  position,
}: {
  data: { label: string[]; data: number[] };
  loading: boolean;
  position: string;
}) {
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
          breakpoint: 1310,
          options: {
            legend: {
              position: 'top',
            },
          },
        },
        {
          breakpoint: 768,
          options: {
            chart: {
              width: 380,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 320,
            },
            legend: {
              position: 'top',
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
    setChartData({
      ...chartData,
      series: data.data,
      options: {
        ...chartData.options,
        labels: data.label,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="p-4 relative flex-1">
      {loading ? (
        <div
          className="h-52 md:h-96 w-52 md:w-96 rounded-full mx-auto bg-gray-300 animate-pulse"
          style={{ animationDelay: '0.2s' }}
        />
      ) : (
        <div>
          {chartData.series.length > 0 ? (
            <>
              <button
                type="button"
                className={`absolute -bottom-4 text-sm font-medium ${
                  position === 'right' ? 'right-0' : 'left-0'
                } bg-amber-200 px-4 py-1 rounded-lg z-30`}
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
          ) : (
            <div className="border mx-auto rounded-full h-52 md:h-96 w-52 md:w-96 flex items-center justify-center">
              <div className="flex items-center justify-center gap-2 my-2">
                <ErrorSVG />
                <h2 className="font-medium text-gray-800  ">
                  No Data Available
                </h2>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BarChart;
