import React, { useEffect, useState } from "react";
import { fetchData, addData } from "./services/sheetsService";

function App() {
  const [data, setData] = useState([]);
  const [newRow, setNewRow] = useState(["", "", ""]); // Example row with 3 columns

  useEffect(() => {
    fetchData().then(setData);
  }, []);

  const handleAddData = async () => {
    await addData(newRow);
    fetchData().then(setData);
  };

  return (
    <div>
      <h1>Google Sheets API Integration</h1>
      <table border="1">
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {row.map((cell, i) => (
                <td key={i}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <input onChange={(e) => setNewRow([e.target.value, newRow[1], newRow[2]])} />
      <button onClick={handleAddData}>Add Row</button>
    </div>
  );
}

export default App;
