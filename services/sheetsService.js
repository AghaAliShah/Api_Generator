const API_URL = "http://localhost:5000/sheets";

export const fetchData = async () => {
  const response = await fetch(`${API_URL}/data`);
  return response.json();
};

export const addData = async (newRow) => {
  await fetch(`${API_URL}/data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ values: [newRow] }),
  });
};
