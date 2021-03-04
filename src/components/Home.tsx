import React, { useEffect, useState } from "react";
import Select from "react-select/";
import { endpointUrl } from "../config";
import Chart from "./Chart";
import Typography from "@material-ui/core/Typography";
import { useTheme } from "@material-ui/core";
import options from "../data/options";
import {
  getSelectTheme,
  groupStyles,
  groupBadgeStyles,
} from "../helper/selectStylings";
import Footer from "./Footer";

export interface Option {
  value: string;
  label: string;
  type: "COUNTRY" | "DISTRICT" | "STATE";
}

const Home: React.FC = () => {
  const theme = useTheme();
  const formThemeColors = getSelectTheme(theme);

  const [selectedIds, setSelectedIds] = useState<Option[]>();

  // Store current ids as URL params to allow bookmarking
  useEffect(() => {
    if (selectedIds) {
      if (selectedIds.length) {
        const params = new URLSearchParams();
        selectedIds?.forEach((id) => params.append("id", id.value));
        window.history.replaceState(
          null,
          "Inzidenz Trend",
          "?" + params.toString()
        );
      } else {
        window.history.replaceState(null, "Inzidenz Trend", "/");
      }
    }
  }, [selectedIds]);

  // Restore eventually passed URL params
  useEffect(() => {
    const ids = new URLSearchParams(window.location.search).getAll("id");

    if (ids.length) {
      const selectedOptions = ids.flatMap((id) =>
        options
          .filter((reg) => reg.options.find((e) => e.value === id))
          .map((reg) => reg.options.find((e) => e.value === id))
      );
      setSelectedIds(selectedOptions as Option[]);
    }
  }, []);

  const formatGroupLabel = (data: any) => (
    <div style={groupStyles}>
      <span>{data.label}</span>
      <span style={groupBadgeStyles as any}>{data.options.length}</span>
    </div>
  );

  const generateEndpoints = (ids: Option[]) => {
    return ids.map((i) => {
      if (i.type === "COUNTRY")
        return `${endpointUrl}/germany/history/incidence`;
      if (i.type === "STATE")
        return `${endpointUrl}/states/${i.value}/history/incidence`;
      if (i.type === "DISTRICT")
        return `${endpointUrl}/districts/${i.value}/history/incidence`;
      return "";
    });
  };

  return (
    <div className="mx-4 min-h-screen relative pb-12">
      <div className="py-6">
        <Typography variant="h2">Inzidenz Trend</Typography>
        <Typography>
          Diese Seite zeigt den historischen Verlauf der 7-Tage-Inzidenz der
          COVID-19 Fallzahlen für Deutschland.
        </Typography>
      </div>
      <style>{`.select__multi-value__remove { color: ${theme.palette.success.contrastText} }`}</style>
      <style>{`.select__input { color: ${theme.palette.text.primary} }`}</style>
      <Select
        className="basic-single mb-12"
        classNamePrefix="select"
        isSearchable={true}
        name="district-select"
        options={options}
        value={selectedIds}
        formatGroupLabel={formatGroupLabel}
        onChange={(e: any) => setSelectedIds(e)}
        isMulti
        placeholder="Region suchen..."
        theme={(theme) =>
          ({
            ...theme,
            colors: {
              ...formThemeColors,
            },
          } as any)
        }
      />
      {selectedIds && (
        <Chart
          endpoints={generateEndpoints(selectedIds)}
          ids={selectedIds.map((id) => id.value)}
          names={selectedIds.map((id) => id.label)}
        />
      )}
      <div className="absolute bottom-0 h-12 w-full flex items-center flex-wrap">
        <Footer/>
      </div>
    </div>
  );
};

export default Home;
