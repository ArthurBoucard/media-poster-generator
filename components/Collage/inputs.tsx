import React from "react";

interface CollageSettingsProps {
  columns: number;
  rows: number;
  ratio: string
  setColumns: (value: number) => void;
  setRows: (value: number) => void;
  setRatio: (value: string) => void;
}

const CollageSettings: React.FC<CollageSettingsProps> = ({ columns, rows, ratio, setColumns, setRows, setRatio }) => {
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
      <label htmlFor="rows" className="font-medium text-gray-900 dark:text-white">Ratio:</label>
      <select
        id="ratio"
        value={ratio}
        onChange={(e) => setRatio(e.target.value)}
        className="bg-emerald-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
      >
        <option value={1}>1:1</option>
        <option value={4 / 3}>4:3</option>
        <option value={16 / 9}>16:9</option>
        <option value={3 / 2}>3:2</option>
      </select>
    </div>
  );
};

export default CollageSettings;
