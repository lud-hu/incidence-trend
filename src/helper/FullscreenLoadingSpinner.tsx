import { CircularProgress, Fade } from "@material-ui/core";
import React from "react";

const FullscreenLoadingSpinner: React.FC<{ isLoading: boolean }> = (props: {
  isLoading: boolean;
}) => {
  return (
    <Fade
      in={props.isLoading}
      style={{
        transitionDelay: props.isLoading ? "400ms" : "0ms",
      }}
      unmountOnExit
    >
      <div className="absolute w-full h-full top-0 left-0 bottom-0 right-0 flex justify-center items-center bg-black bg-opacity-50 z-10">
        <CircularProgress />
      </div>
    </Fade>
  );
};

export default FullscreenLoadingSpinner;
