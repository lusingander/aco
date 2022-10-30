import TextField from "@mui/material/TextField";
import { useState } from "react";

export const useTextFieldState = () => {
  const [text, setText] = useState("");
  const updateText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  return [text, setText, updateText] as const;
};

export const InOutTextField = (props: {
  label: string;
  text: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <TextField
    inputProps={{ style: { fontFamily: "monospace" } }}
    label={props.label}
    multiline
    fullWidth
    minRows={15}
    maxRows={15}
    margin="normal"
    variant="filled"
    value={props.text}
    onChange={props.onChange}
  />
);
