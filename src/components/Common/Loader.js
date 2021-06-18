import React from "react";
import classNames from "classnames";
import HashLoader from "react-spinners/HashLoader";

export const Loader = ({ size = "md", bgClass = "transparent" }) => {
  return (
    <div
      className={classNames(
        "loader-main d-flex align-items-center justify-content-center w-100 h-100",
        {
          [size]: size,
          [bgClass]: bgClass,
        }
      )}
    >
      <HashLoader color="#222a42" size={size === "md" ? 60 : 100} />
    </div>
  );
};
