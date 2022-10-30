import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Unstable_Grid2";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";

import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { Commands, ToUpper } from "../wailsjs/go/main/App";
import { main } from "../wailsjs/go/models";

const useTextFieldState = () => {
  const [text, setText] = useState("");
  const updateText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  return [text, setText, updateText] as const;
};

const InOutTextField = (props: {
  label: string;
  text: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <TextField
    inputProps={{ style: { fontFamily: "monospace" } }}
    label={props.label}
    multiline
    fullWidth
    minRows={20}
    maxRows={20}
    margin="normal"
    variant="filled"
    value={props.text}
    onChange={props.onChange}
  />
);

const runCommand = (input: string, f: (output: string) => void): void => {
  ToUpper(input).then(f);
};

const tableColumns: GridColDef[] = [
  { field: "col_desc", headerName: "Description", width: 300 },
  { field: "col_cmd", headerName: "Command", width: 500 },
];

const commandsToRows = (commands: main.Command[]) =>
  commands.map((c, i) => ({
    id: i,
    col_desc: c.description,
    col_cmd: c.cmd,
  }));

function App() {
  const [stdinText, , updateStdinText] = useTextFieldState();
  const [stdoutText, setStdoutText, updateStdoutText] = useTextFieldState();
  const [rows, setRows] = useState<GridRowsProp>([]);

  useEffect(() => {
    const loadCommands = async () => {
      const cs = await Commands();
      setRows(commandsToRows(cs));
    };
    loadCommands();
  }, []);

  return (
    <div id="App">
      <Box sx={{ height: 200 }}>
        <DataGrid rows={rows} columns={tableColumns} density={"compact"} />
      </Box>
      <Box textAlign="center">
        <Button
          variant="outlined"
          onClick={() => runCommand(stdinText, setStdoutText)}
        >
          Run
        </Button>
      </Box>
      <Grid container spacing={2}>
        <Grid xs={6}>
          <InOutTextField
            label="Stdin"
            text={stdinText}
            onChange={updateStdinText}
          />
        </Grid>
        <Grid xs={6}>
          <InOutTextField
            label="Stdout"
            text={stdoutText}
            onChange={updateStdoutText}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
