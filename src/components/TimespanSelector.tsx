import { Button } from "@material-ui/core";
import React from "react";

const TimespanSelector: React.FC<Props> = (props: Props) => {
  return (
    <div className="flex justify-center flex-wrap">
      {props.values.map((v) => (
        <Button
          key={v.days}
          variant="contained"
          color="default"
          style={{ marginRight: "0.5rem", marginBottom: "0.5rem" }}
          onClick={() => props.setter(v.days)}
          disabled={v.days === props.activeValue}
        >
          {v.title}
        </Button>
      ))}
    </div>
  );
};

interface Props {
  activeValue: number;
  values: { days: number; title: string }[];
  setter: (n: number) => void;
}

export default TimespanSelector;
