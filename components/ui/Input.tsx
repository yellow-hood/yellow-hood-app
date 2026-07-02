"use client";

import * as React from "react";
import { Input as QuiInput } from "@qpub/qui";

type QuiInputProps = React.ComponentProps<typeof QuiInput>;

interface InputProps extends Omit<QuiInputProps, "onChange"> {
  onValueChange?: (value: string) => void;
  startContent?: React.ReactNode; // accepted but not rendered (decorative icons not in @qpub/qui Input)
  labelPlacement?: string; // accepted and ignored — @qpub/qui always renders label above input
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function Input({
  onValueChange,
  startContent: _startContent,
  labelPlacement: _labelPlacement,
  onChange,
  ...props
}: InputProps) {
  const handleChange = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      onChange?.(e);
      onValueChange?.(e.target.value);
    },
    [onChange, onValueChange],
  );

  return <QuiInput onChange={handleChange} {...props} />;
}
