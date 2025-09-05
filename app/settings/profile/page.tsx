"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function EditProfilePage() {
  const { id } = useParams();
  const { userId } = useAuth();
  const router = useRouter();
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (parseInt(id as string) !== userId) {
        router.push(`/profile/${id}`);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token available");

        const response = await fetch(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && data.data.user) {
            setBio(data.data.user.bio || "");
            setProfilePicture(data.data.user.profilePicture || "");
          }
        } else {
          setError("Failed to load user data");
        }
      } catch (error) {
        console.error("Fetch user data error:", error);
        setError("Network error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, userId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");

      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bio, profilePicture }),
      });

      if (response.ok) {
        router.push(`/profile/${id}`);
      } else {
        const errorText = await response.text();
        setError(`Failed to update profile: ${errorText}`);
      }
    } catch (error) {
      console.error("Update profile error:", error);
      setError("Network error occurred");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
          <input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Picture URL</label>
          <input
            type="text"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}