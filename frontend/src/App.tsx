import { Button } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { Box } from "@mui/system";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridSelectionModel,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Commands, RunCommand } from "../wailsjs/go/main/App";
import { main } from "../wailsjs/go/models";
import { InOutTextField, useTextFieldState } from "./InOutTextField";

const runCommand = (
  input: string,
  command: main.Command | undefined,
  onSuccess: (output: string) => void,
  onFailure: (err: string) => void
): void => {
  if (command) {
    RunCommand(input, command).then(onSuccess).catch(onFailure);
  }
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
    cmd: c,
  }));

function App() {
  const [stdinText, setStdinText, updateStdinText] = useTextFieldState();
  const [stdoutText, setStdoutText, updateStdoutText] = useTextFieldState();
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [selected, setSelected] = useState<main.Command | undefined>(undefined);

  const clear = () => {
    setStdinText("");
    setStdoutText("");
  };

  useEffect(() => {
    const loadCommands = async () => {
      const cs = await Commands();
      setRows(commandsToRows(cs));
    };
    loadCommands();
  }, []);

  const onRowSelected = (selected: GridSelectionModel) => {
    if (selected) {
      const id = selected[0];
      const row = rows.find((r) => r.id === id);
      setSelected(row?.cmd);
    }
  };

  return (
    <div id="App">
      <Box sx={{ height: 300 }}>
        <DataGrid
          rows={rows}
          columns={tableColumns}
          density={"compact"}
          onSelectionModelChange={onRowSelected}
        />
      </Box>
      <Box textAlign="center">
        <Button
          variant="outlined"
          onClick={
            () => runCommand(stdinText, selected, setStdoutText, setStdoutText) // todo: handle error
          }
        >
          Run
        </Button>
        <Button variant="outlined" onClick={clear}>
          Clear
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
