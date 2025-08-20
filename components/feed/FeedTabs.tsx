interface FeedTabsProps {
  activeTab: "forYou" | "following";
  setActiveTab: React.Dispatch<React.SetStateAction<"forYou" | "following">>;
}

export default function FeedTabs({ activeTab, setActiveTab }: FeedTabsProps) {
  return (
    <>
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-14 z-40">
        <div className="flex max-w-3xl mx-auto">
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === "forYou"
                ? "text-sky-500 font-bold border-b-2 border-sky-500" 
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" 
            }
          `}
            onClick={() => setActiveTab("forYou")}
          >
            For You
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === "following"
                ? "text-sky-500 font-bold border-b-2 border-sky-500" 
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" 
            }`}
            onClick={() => setActiveTab("following")}
          >
            Following
          </button>
        </div>
      </div>
    </>
  );
}
