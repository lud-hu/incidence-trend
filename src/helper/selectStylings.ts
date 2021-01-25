import { Theme } from "@material-ui/core";
/**
 * Some color overrides for dark-themed react-select.
 * See https://github.com/JedWatson/react-select/issues/3692#issuecomment-671084399
 */
export const getSelectTheme = (theme: Theme) => {
  return {
    danger: "black",
    dangerLight: theme.palette.grey[200], // multiValue(remove)/bgColor
    neutral0: theme.palette.background.default,
    neutral5: "orange",
    neutral10: theme.palette.text.primary, // multiValue/backgroundColor
    neutral20: theme.palette.grey[300],
    neutral30: theme.palette.text.primary,
    neutral40: "white",
    neutral50: theme.palette.grey["A200"],
    neutral60: "white",
    neutral70: "white",
    neutral80: theme.palette.success.contrastText, // multiValue(label)/color
    neutral90: "white",
    primary: theme.palette.text.primary,
    primary25: theme.palette.background.paper,
    primary50: theme.palette.background.paper,
    primary75: theme.palette.background.paper,
  };
};

export const groupStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

export const groupBadgeStyles = {
  backgroundColor: "#EBECF0",
  borderRadius: "2em",
  color: "#172B4D",
  display: "inline-block",
  fontSize: 12,
  fontWeight: "normal",
  lineHeight: "1",
  minWidth: 1,
  padding: "0.16666666666667em 0.5em",
  textAlign: "center",
};
