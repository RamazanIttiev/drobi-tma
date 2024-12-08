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
  const {
    onClick,
    text,
    isLoading,
    backgroundColor,
    textColor,
    hasShineEffect,
    isEnabled,
    isVisible,
    isLoaderVisible,
  } = props;
  const { themeParams } = useLaunchParams();

  useEffect(() => {
    mountMainButton();
    setMainButtonParams({
      text,
      isVisible: isVisible ?? true,
      hasShineEffect: hasShineEffect ?? true,
      isEnabled: isEnabled ?? !isLoading,
      isLoaderVisible: isLoaderVisible ?? isLoading,
      backgroundColor: backgroundColor ?? themeParams?.buttonColor,
      textColor: textColor ?? themeParams?.buttonTextColor,
    });

    return () => {
      setMainButtonParams({
        isVisible: false,
      });
    };
  }, [
    backgroundColor,
    hasShineEffect,
    isEnabled,
    isLoaderVisible,
    isLoading,
    isVisible,
    text,
    textColor,
    themeParams?.buttonColor,
    themeParams?.buttonTextColor,
  ]);

  useEffect(() => {
    onMainButtonClick(onClick);

    return () => mainButton.offClick(onClick);
  }, [onClick]);
};
