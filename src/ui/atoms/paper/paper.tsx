import { HTMLAttributes } from "react";

import "./paper.css";

export const Paper = (props: HTMLAttributes<HTMLDivElement>) => {
  const { children } = props;

  return <div className={"paper"}>{children}</div>;
};
