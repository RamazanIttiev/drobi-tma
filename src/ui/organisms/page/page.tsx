import { useNavigate } from "react-router-dom";
import { backButton, classNames } from "@telegram-apps/sdk-react";
import { PropsWithChildren, useEffect } from "react";

import "./page.css";

interface Props {
  /**
   * True if it is allowed to go back from this page.
   */
  back?: boolean;
  verticalPaddingDisabled?: boolean;
  horizontalPaddingDisabled?: boolean;
}

export function Page(props: PropsWithChildren<Props>) {
  const {
    children,
    back = true,
    verticalPaddingDisabled = false,
    horizontalPaddingDisabled = false,
  } = props;
  const navigate = useNavigate();

  useEffect(() => {
    if (back) {
      backButton.show();
      return backButton.onClick(() => {
        navigate(-1);
      });
    }
    backButton.hide();
  }, [back, navigate]);

  const classnames = classNames(
    !verticalPaddingDisabled && "page--verticalPadding",
    !horizontalPaddingDisabled && "page--horizontalPadding",
  );

  return <div className={classnames}>{children}</div>;
}
