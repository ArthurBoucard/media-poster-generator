import React from "react";

interface CollageSettingsProps {
  columns: number;
  rows: number;
  setColumns: (value: number) => void;
  setRows: (value: number) => void;
}

const CollageSettings: React.FC<CollageSettingsProps> = ({ columns, rows, setColumns, setRows }) => {
  return (
    <div className="mb-4 flex space-x-4">
      <label htmlFor="columns" className="font-medium text-gray-900 dark:text-white">Columns:</label>
      <input
        type="number"
        id="columns"
        value={columns}
        onChange={(e) => setColumns(Number(e.target.value))}
        min={1}
        className="bg-emerald-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
      />
      <label htmlFor="rows" className="font-medium text-gray-900 dark:text-white">Rows:</label>
      <input
        type="number"
        id="rows"
        value={rows}
        onChange={(e) => setRows(Number(e.target.value))}
        min={1}
        className="bg-emerald-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
      />
    </div>
  );
};

export default CollageSettings;
