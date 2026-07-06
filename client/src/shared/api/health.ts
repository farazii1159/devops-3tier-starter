const apiBaseUrl = import.meta.env.VITE_API_URL ?? "";

export async function fetchHealth(): Promise<{
  status: string;
  timestamp: string;
  database: string;
}> {
  const response = await fetch(`${apiBaseUrl}/api/health`);

  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }

  return response.json() as Promise<{
    status: string;
    timestamp: string;
    database: string;
  }>;
}
