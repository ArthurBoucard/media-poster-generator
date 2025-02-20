import React from "react";

interface CollageSettingsProps {
  columns: number;
  rows: number;
  setColumns: (value: number) => void;
  setRows: (value: number) => void;
}

const CollageSettings: React.FC<CollageSettingsProps> = ({ columns, rows, setColumns, setRows }) => {
  return (
    <div className="mb-4">
      <label htmlFor="columns" className="mr-2">Columns:</label>
      <input
        type="number"
        id="columns"
        value={columns}
        onChange={(e) => setColumns(Number(e.target.value))}
        min={1}
        className="border p-2 rounded"
      />
      <label htmlFor="rows" className="ml-4 mr-2">Rows:</label>
      <input
        type="number"
        id="rows"
        value={rows}
        onChange={(e) => setRows(Number(e.target.value))}
        min={1}
        className="border p-2 rounded"
      />
    </div>
  );
};

export default CollageSettings;
