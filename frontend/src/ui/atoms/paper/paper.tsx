import { HTMLAttributes } from "react";
import { classNames } from "@telegram-apps/sdk-react";

import "./paper.css";

export const Paper = (props: HTMLAttributes<HTMLDivElement>) => {
  const { children, className } = props;

  const classnames = classNames("paper", className);

  return <div className={classnames}>{children}</div>;
};
