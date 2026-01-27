"use client";

import { useState, useEffect } from "react";
// import { useAuth } from "@/hooks/useAuth";

export default function SettingsPage() {
  // const { userId } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token available");

        const response = await fetch("/api/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setNotifications(data.data.notifications);
          }
        } else {
          setError("Failed to load settings");
        }
      } catch (error) {
        console.error("Fetch settings error:", error);
        setError("Network error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");

      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notifications }),
      });

      if (response.ok) {
        console.log("Settings saved successfully");
      } else {
        const errorText = await response.text();
        setError(`Failed to save settings: ${errorText}`);
      }
    } catch (error) {
      console.error("Update settings error:", error);
      setError("Network error occurred");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="mr-2"
            />
            Enable Notifications
          </label>
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}