"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Sidebar from "@/components/ui/Sidebar";
import BottomNav from "@/components/ui/BottomNav";

interface SearchResult {
  id: string;
  type: "user" | "post";
  name?: string;
  username?: string;
  content?: string;
}

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  const mockData: SearchResult[] = [
    { id: "1", type: "user", name: "Alice Johnson", username: "@alice" },
    { id: "2", type: "user", name: "Bob Smith", username: "@bob" },
    { id: "3", type: "post", content: "Just tried the new SocialApp" },
    { id: "4", type: "post", content: "Hello world! First post" },
  ];

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim() === "") {
      setResults([]);
      return;
    }
    const filtered = mockData.filter((item) =>
      item.type === "user"
        ? item.name?.toLowerCase().includes(value.toLowerCase()) ||
          item.username?.toLowerCase().includes(value.toLowerCase())
        : item.content?.toLowerCase().includes(value.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <div className="sm:ml-60 flex justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="w-full max-w-2xl px-4 pt-6">
        {/* Search Bar */}
        <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 shadow-sm sticky top-0 z-40">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search users or posts..."
            className="w-full bg-transparent outline-none text-gray-800 dark:text-gray-200"
          />
        </div>

        {/* Results */}
        <div className="mt-6 space-y-4">
          {results.length > 0 ? (
            results.map((item) =>
              item.type === "user" ? (
                <div
                  key={item.id}
                  className="flex items-center p-3 rounded-lg bg-white dark:bg-gray-900 shadow hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold">
                    {item.name?.[0]}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.username}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-white dark:bg-gray-900 shadow hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <p className="text-gray-800 dark:text-gray-200">
                    {item.content}
                  </p>
                </div>
              )
            )
          ) : query ? (
            <p className="text-center text-gray-500 mt-6">
              {`No results found for "${query}"`}
            </p>
          ) : (
            <p className="text-center text-gray-500 mt-6 font-bold">
              Start typing to search ...
            </p>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
