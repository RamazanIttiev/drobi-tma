import { classNames, type RGB as RGBType } from "@telegram-apps/sdk-react";
import type { FC } from "react";

import "./rgb.css";

export type RGBProps = JSX.IntrinsicElements["div"] & {
  color: RGBType;
};

export const Rgb: FC<RGBProps> = ({ color, className, ...rest }) => (
  <span {...rest} className={classNames("rgb", className)}>
    <i className="rgb__icon" style={{ backgroundColor: color }} />
    {color}
  </span>
);
