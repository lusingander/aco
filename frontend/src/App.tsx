import { Button } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { Box } from "@mui/system";
import { useState } from "react";
import { RunCommand } from "../wailsjs/go/main/App";
import { main } from "../wailsjs/go/models";
import { CommandsTable, useCommandRows } from "./CommandsTable";
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

const clearAll = (...fs: ((s: string) => void)[]) => fs.forEach((f) => f(""));

function App() {
  const [stdinText, setStdinText, updateStdinText] = useTextFieldState();
  const [stdoutText, setStdoutText, updateStdoutText] = useTextFieldState();
  const [commandError, setCommandError] = useState(false);
  const [rows, selected, onRowSelected] = useCommandRows();

  return (
    <div id="App">
      <Box sx={{ height: 300 }}>
        <CommandsTable rows={rows} onRowSelected={onRowSelected} />
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
