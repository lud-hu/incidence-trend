import { useTheme } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import CustomizedAxisTick from "../helper/CustomizedAxisTick";
import {
  formatDate,
  generateXTicks,
  generateYTicks,
} from "../helper/formatter";
import FullscreenLoadingSpinner from "../helper/FullscreenLoadingSpinner";
import useMultiQuery from "../hooks/useMultiQuery";
import useWindowSize from "../hooks/useWindowSize";
import TimespanSelector from "./TimespanSelector";

export interface ChartData {
  /** Date in millisecs since 1970 */
  date: number;
  /** key: id of district, value: 7 day incidence */
  [id: string]: number;
}

interface DistrictData {
  ags?: string;
  id?: number;
  history: {
    weekIncidence: number;
    date: string;
  }[];
  name: string;
}

export interface DistrictResponse {
  data: {
    [id: string]: DistrictData;
  };
  meta: any;
}

const Chart: React.FC<Props> = (props: Props) => {
  const theme = useTheme();
  const screenSize = useWindowSize();
  const isMobile = () => (screenSize.width ? screenSize.width < 860 : false);

  const [tableData, setTableData] = useState<ChartData[]>();
  const [xTicks, setXTicks] = useState<number[]>([0]);
  const [yTicks, setYTicks] = useState<number[]>([0]);
  const [highlightedId, setHighlightedId] = useState<string>("");
  const [lastDayCount, setLastDayCount] = useState<number>(31);

  const { data, isLoading } = useMultiQuery<DistrictResponse>(
    lastDayCount > 0
      ? props.endpoints.map((e) => `${e}/${lastDayCount}`)
      : props.endpoints,
    {
      // cacheTime: 0,
      keepPreviousData: false,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    }
  );

  // Use some of the theme colors for coloring the lines in the chart
  const colors = [
    theme.palette.secondary.dark,
    theme.palette.error.dark,
    theme.palette.warning.dark,
    theme.palette.info.dark,
    theme.palette.success.dark,
    theme.palette.primary.dark,
  ];

  useEffect(() => {
    console.log(data);
    // We'll wait until all the queries have resolved, so that
    // we get smooth animations in the graph (otherwise some will return
    // earlier and enforce rerenders).
    if (data.length === props.endpoints.length) {
      // Prepare Data
      const newTableData = transformData(data);
      setTableData(newTableData);

      // Prepare Ticks
      setXTicks(
        generateXTicks(newTableData[0].date, newTableData.slice(-1)[0].date)
      );
      const maxIncidence = newTableData.reduce((a, b) => {
        return Math.max(a, ...Object.values(b).filter((b) => b < 10000));
      }, 0);
      setYTicks(generateYTicks(maxIncidence));
    }
    // eslint-disable-next-line
  }, [data]);

  /** Small helper */
  const getDistrictData = (d: DistrictResponse): DistrictData => {
    if (Array.isArray(d.data)) {
      // GERMANY
      return {
        history: d.data,
        ags: "DE",
        name: "Germany",
      };
    } else {
      // STATE OR DISTRICT
      return {
        ...Object.values(d.data)[0],
        ags: Object.keys(d.data)[0],
      };
    }
  };

  /**
   * Transforms the data that was received for each
   * district to a single data object that can be rendered
   * by the recharts library.
   */
  const transformData = (districtRes: DistrictResponse[]): ChartData[] => {
    return getDistrictData(districtRes[0]).history.map((historyEntry) => {
      // Prepare and entry with the date
      const entry: ChartData = {
        date: new Date(historyEntry.date).getTime(),
      };

      // Now add incidence data for each district for the date
      districtRes.forEach((district) => {
        const incidenceData = getDistrictData(district).history.find(
          (h) => historyEntry.date === h.date
        );
        if (
          incidenceData &&
          (getDistrictData(district).ags || getDistrictData(district).id)
        ) {
          entry[
            getDistrictData(district).ags ||
              getDistrictData(district).id ||
              "jo"
          ] = Math.round(incidenceData.weekIncidence);
        }
      });
      return entry;
    });
  };

  return (
    <div>
      <FullscreenLoadingSpinner isLoading={isLoading} />
      <ResponsiveContainer
        height={isMobile() ? 300 + props.endpoints.length * 20 : 450}
        width="100%"
      >
        <LineChart
          data={tableData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme.palette.grey[600]}
          />
          <XAxis
            dataKey="date"
            dy={10}
            height={70}
            type="number"
            domain={["dataMin", "dataMax"]}
            tick={<CustomizedAxisTick />}
            interval={xTicks.length > 12 ? 1 : 0}
            ticks={xTicks}
          />
          <YAxis
            width={35}
            ticks={yTicks}
            interval={yTicks.length > 10 ? 1 : 0}
          />
          <ReferenceLine
            y={200}
            stroke={theme.palette.error.light}
            strokeDasharray="3 3"
          />
          <Tooltip
            labelStyle={{ color: theme.palette.success.contrastText }}
            labelFormatter={(date) => formatDate(date as number)}
          />
          <Legend
            layout="vertical"
            verticalAlign={isMobile() ? "bottom" : "middle"}
            align={isMobile() ? "center" : "right"}
            onMouseEnter={(o) => setHighlightedId((o as any).dataKey)}
            onMouseLeave={() => setHighlightedId("")}
            wrapperStyle={{
              paddingLeft: "10px",
            }}
          />
          {props.endpoints.map((id, i) => (
            <Line
              key={i}
              type="monotone"
              dataKey={props.ids[i]}
              name={props.names[i]}
              stroke={colors[i]}
              dot={false}
              strokeWidth={2}
              strokeOpacity={
                highlightedId === "" || props.ids[i] === highlightedId ? 1 : 0.5
              }
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-center mt-6">
        <TimespanSelector
          activeValue={lastDayCount}
          values={[
            { days: 7, title: "1 Woche" },
            { days: 31, title: "1 Monat" },
            { days: 183, title: "6 Monate" },
            { days: 365, title: "1 Jahr" },
            { days: -1, title: "Maximal" },
          ]}
          setter={setLastDayCount}
        />
      </div>
    </div>
  );
};

interface Props {
  endpoints: string[];
  ids: (string | number)[];
  names: string[];
}

export default Chart;
