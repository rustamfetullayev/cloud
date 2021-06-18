import React from "react";
import classNames from "classnames";

export const InputCheckbox = ({
  label,
  checked,
  disabled,
  onChange,
  className,
}) => {
  return (
    <button
      type="button"
      className={classNames("form-control-check d-flex align-items-center", {
        checked,
        disabled,
        [className]: className,
      })}
      onClick={() => !disabled && onChange(checked)}
    >
      {label && <label>{label}</label>}
    </button>
  );
};
