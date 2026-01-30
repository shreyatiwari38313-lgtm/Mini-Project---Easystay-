import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ApiTest() {
  const [status, setStatus] = useState<string>("Not tested");
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      console.log("Testing connection to backend...");
      const response = await axios.get("http://localhost:8000/api/v1/test", {
        timeout: 5000
      });
      console.log("Response:", response.data);
      setStatus(`✅ Backend Connected: ${response.data.message}`);
    } catch (error: any) {
      console.error("Error:", error);
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 m-4 max-w-md">
      <h2 className="font-bold mb-4">Backend Connection Test</h2>
      <p className="mb-4 text-sm">{status}</p>
      <Button onClick={testConnection} disabled={loading}>
        {loading ? "Testing..." : "Test Connection"}
      </Button>
    </Card>
  );
}
