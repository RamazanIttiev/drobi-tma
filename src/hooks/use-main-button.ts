import { useEffect } from "react";
import {
  mainButton,
  MainButtonState,
  mountMainButton,
  onMainButtonClick,
  setMainButtonParams,
  useLaunchParams,
} from "@telegram-apps/sdk-react";

interface Props extends Partial<MainButtonState> {
  onClick?: () => void | Promise<void>;
}

export const useMainButton = (props: Props) => {
  const { onClick } = props;
  const { themeParams } = useLaunchParams();

  useEffect(() => {
    mountMainButton();
    setMainButtonParams({
      ...props,
      isVisible: true,
      backgroundColor: themeParams?.buttonColor,
      hasShineEffect: true,
    });

    return () => {
      setMainButtonParams({
        isVisible: false,
      });
    };
  }, [props, themeParams?.buttonColor]);

  useEffect(() => {
    if (onClick) {
      onMainButtonClick(onClick);
    }

    return () => onClick && mainButton.offClick(onClick);
  }, [onClick]);
};
