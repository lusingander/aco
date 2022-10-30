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
  onFailure: (err: string) => void,
  error: (failure: boolean) => void
): void => {
  if (command) {
    RunCommand(input, command)
      .then((v) => {
        onSuccess(v);
        error(false);
      })
      .catch((e) => {
        onFailure(e);
        error(true);
      });
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

const useCommandRows = (convert: (cs: main.Command[]) => GridRowsProp) => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  useEffect(() => {
    const loadCommands = async () => {
      const cs = await Commands();
      const rows = convert(cs);
      setRows(rows);
    };
    loadCommands();
  }, []);
  return rows;
};

const clearAll = (...fs: ((s: string) => void)[]) => fs.forEach((f) => f(""));

function App() {
  const [stdinText, setStdinText, updateStdinText] = useTextFieldState();
  const [stdoutText, setStdoutText, updateStdoutText] = useTextFieldState();
  const [commandError, setCommandError] = useState(false);
  const [selected, setSelected] = useState<main.Command | undefined>(undefined);
  const rows = useCommandRows(commandsToRows);

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
          sx={{
            "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
              outline: "none !important",
            },
          }}
          rows={rows}
          columns={tableColumns}
          density={"compact"}
          onSelectionModelChange={onRowSelected}
          hideFooterSelectedRowCount
        />
      </Box>
      <Box textAlign="center">
        <Button
          variant="outlined"
          disabled={!selected}
          onClick={() =>
            runCommand(
              stdinText,
              selected,
              setStdoutText,
              setStdoutText,
              setCommandError
            )
          }
        >
          Run
        </Button>
        <Button
          variant="outlined"
          onClick={() => clearAll(setStdinText, setStdoutText)}
        >
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
            error={commandError}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
