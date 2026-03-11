import { MoreVertical } from "lucide-react";
import { useState } from "react";
import type { DocumentItem } from "../types";

interface ReadingCardProps {
  document: DocumentItem;
  viewMode: "grid" | "list";
}

export default function ReadingCard({ document, viewMode }: ReadingCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCardClick = () => {
    // TODO: Navigate to document reader
    console.log("Opening document:", document.title);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleMenuAction = (action: string) => {
    console.log(`Action: ${action} for document:`, document.title);
    setMenuOpen(false);
  };

  // Grid View
  if (viewMode === "grid") {
    return (
      <>
        <div
          onClick={handleCardClick}
          className="overflow-hidden rounded-3xl border border-[#d8d8d8] dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(0,0,0,0.18)] dark:hover:shadow-[0_14px_40px_rgba(0,0,0,0.4)] cursor-pointer"
        >
          <img
            src={document.coverImage}
            alt={document.title}
            className="w-full h-40 object-cover"
          />

          <div className="p-4 flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-700 dark:text-gray-200 truncate">
                {document.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                {document.subtitle}
              </p>
            </div>

            <div className="relative ml-2">
              <MoreVertical
                size={18}
                className="text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                onClick={handleMenuClick}
              />

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
                  <button
                    onClick={() => handleMenuAction("open")}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => handleMenuAction("rename")}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => handleMenuAction("delete")}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Click outside to close menu */}
        {menuOpen && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </>
    );
  }

  // List View
  return (
    <>
      <div
        onClick={handleCardClick}
        className="overflow-hidden rounded-3xl border border-gray-700 bg-gray-800 shadow-md transition-all duration-300 hover:shadow-[0_14px_40px_rgba(0,0,0,0.18)] cursor-pointer flex items-center"
      >
        <img
          src={document.coverImage}
          alt={document.title}
          className="w-32 h-24 object-cover shrink-0"
        />

        <div className="flex-1 p-4 flex justify-between items-center">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold dark:text-gray-200 truncate">
              {document.title}
            </h4>
            <p className="text-xs dark:text-gray-400 line-clamp-1">
              {document.subtitle}
            </p>
          </div>

          <div className="relative ml-4">
            <MoreVertical
              size={18}
              className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
              onClick={handleMenuClick}
            />

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <button
                  onClick={() => handleMenuAction("open")}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                >
                  Open
                </button>
                <button
                  onClick={() => handleMenuAction("rename")}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                >
                  Rename
                </button>
                <button
                  onClick={() => handleMenuAction("delete")}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}
