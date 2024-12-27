import { Input as TGUIInput, InputProps } from "@telegram-apps/telegram-ui";

import "./input.css";

export const Input = (props: InputProps) => {
  return <TGUIInput {...props} className={`${props.className} input`} />;
};
