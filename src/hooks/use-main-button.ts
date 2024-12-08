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
  onClick: () => void | Promise<void>;
  isLoading?: boolean;
}

export const useMainButton = (props: Props) => {
  const { onClick, isLoading } = props;
  const { themeParams } = useLaunchParams();

  useEffect(() => {
    mountMainButton();
    setMainButtonParams({
      ...props,
      isVisible: true,
      isEnabled: !isLoading,
      isLoaderVisible: isLoading,
      backgroundColor: themeParams?.buttonColor,
      hasShineEffect: true,
    });

    return () => {
      setMainButtonParams({
        isVisible: false,
      });
    };
  }, [isLoading, props, themeParams?.buttonColor]);

  useEffect(() => {
    onMainButtonClick(onClick);

    return () => mainButton.offClick(onClick);
  }, [onClick]);
};
