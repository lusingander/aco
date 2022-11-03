import TextField from "@mui/material/TextField";
import React, { useState } from "react";

export const useTextFieldState = () => {
  const [text, setText] = useState("");
  const updateText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  return [text, setText, updateText] as const;
};

type InOutTextFieldProps = {
  label: string;
  text: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
};

export const InOutTextField: React.FC<InOutTextFieldProps> = ({
  label,
  text,
  onChange,
  error,
}) => (
  <TextField
    inputProps={{ style: { fontFamily: "monospace" } }}
    label={label}
    multiline
    fullWidth
    minRows={15}
    maxRows={15}
    margin="normal"
    variant="filled"
    error={error}
    value={text}
    onChange={onChange}
  />
);
