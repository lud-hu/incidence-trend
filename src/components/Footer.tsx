import React from "react";

const Footer: React.FC = () => {
  return (
    <>
    <span className="mr-1">
      Daten:{" "}
      <a
        href="https://api.corona-zahlen.org/docs/#data-sources"
        className="underline pointer"
        target="_blank"
        rel="noreferrer"
        >
        RKI
      </a>
      ,
    </span>
    <span className="mr-1">
      Aggregation:{" "}
      <a
        href="https://api.corona-zahlen.org/docs/"
        className="underline pointer"
        target="_blank"
        rel="noreferrer"
        >
        Marlon Lückert
      </a>
      ,
    </span>
    <span className="mr-1">
      Darstellung:{" "}
      <a
        href="https://github.com/lud-hu/incidence-trend"
        className="underline pointer text-right"
        target="_blank"
        rel="noreferrer"
        >
        Ludwig Hubert
      </a>
    </span>
    </>
  );
};

export default Footer;
