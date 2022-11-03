import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridSelectionModel,
} from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Commands } from "../wailsjs/go/main/App";
import { main } from "../wailsjs/go/models";

const cmdStr = (command: main.Command) => {
  if (command.pipeline) {
    return command.pipeline.join(" | ");
  } else {
    return command.cmd;
  }
};

const convert = (commands: main.Command[]) =>
  commands.map((c, i) => ({
    id: i,
    col_desc: c.description,
    col_cmd: cmdStr(c),
    cmd: c,
  }));

export const useCommandRows = () => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [selected, setSelected] = useState<main.Command | undefined>(undefined);
  useEffect(() => {
    const loadCommands = async () => {
      const cs = await Commands();
      const rows = convert(cs);
      setRows(rows);
    };
    loadCommands();
  }, []);
  const onRowSelected = (m: GridSelectionModel) => {
    if (m) {
      const id = m[0];
      const row = rows.find((row) => row.id === id);
      setSelected(row?.cmd);
    }
  };
  return [rows, selected, onRowSelected] as const;
};

const tableColumns: GridColDef[] = [
  { field: "col_desc", headerName: "Description", width: 300 },
  { field: "col_cmd", headerName: "Command", width: 500 },
];

type CommandsTableProps = {
  rows: GridRowsProp;
  onRowSelected: (model: GridSelectionModel) => void;
};

export const CommandsTable: React.FC<CommandsTableProps> = ({
  rows,
  onRowSelected,
}) => (
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
);
