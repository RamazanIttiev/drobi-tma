import { ChangeEvent, SelectHTMLAttributes, useRef } from "react";
import { classNames } from "@telegram-apps/sdk-react";
import { Select as SelectTG, Text } from "@telegram-apps/telegram-ui";
import SelectIcon from "@/assets/icons/select-icon.svg";

import "./select.css";

interface SelectProps<T>
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value"> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  custom?: boolean;
}

export function Select<T extends string>(props: SelectProps<T>) {
  const { children, label, className, onChange, custom = true } = props;
  const selectRef = useRef<HTMLSelectElement>(null);
  const classnames = classNames("select", className);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as T);
  };

  const handleDivClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();

    if (selectRef.current) {
      selectRef.current.focus();
      selectRef.current.dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true }),
      );
      selectRef.current.showPicker();
    }
  };

  return custom ? (
    <div className={classnames} onClick={handleDivClick}>
      <Text weight={"3"} htmlFor={"select__field"} className={"select__label"}>
        {label}
      </Text>
      <div className={"select__inner"}>
        <select
          {...props}
          ref={selectRef}
          id={"select__field"}
          className={"select__field"}
          onChange={handleChange}
        >
          {children}
        </select>
        <div className={"select__icon"}>
          <SelectIcon />
        </div>
      </div>
    </div>
  ) : (
    <SelectTG>{children}</SelectTG>
  );
}
