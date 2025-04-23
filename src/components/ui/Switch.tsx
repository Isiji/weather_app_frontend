import { useState } from "react";
import classNames from "classnames";

type SwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export default function Switch({ checked, onCheckedChange }: SwitchProps) {
  return (
    <button
      onClick={() => onCheckedChange(!checked)}
      className={classNames(
        "w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300",
        checked ? "bg-blue-600" : "bg-gray-300"
      )}
    >
      <div
        className={classNames(
          "w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300",
          checked ? "translate-x-6" : "translate-x-0"
        )}
      />
    </button>
  );
}
