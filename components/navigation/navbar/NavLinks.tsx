"use client";

import { Search, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import { SheetClose } from "@/components/ui/sheet";
import {
  dummyChats,
  yesterdayChats,
  previousWeekChats,
  previousMonthChats,
} from "@/constants";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/app/i18n/client";
import { LoadingSpinner } from "@/components/Loader";

const NavLinks = ({
  isMobileNav = false,
  lng,
}: {
  isMobileNav?: boolean;
  lng: string;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation(lng, "translation");

  useEffect(() => {
    if (i18n.isInitialized) {
      setIsLoading(false);
    }
  }, [i18n.isInitialized]);

  if (isLoading) {
    return (
      <LoadingSpinner className="flex items-center justify-center h-full" />
    );
  }
  const getLocalizedChatTitle = (chat, language) => {
    return chat[`title_${language}`] || chat.title;
  };
  // Filter chats based on search query
  const filteredChats = searchQuery
    ? dummyChats.filter((chat) =>
        getLocalizedChatTitle(chat, lng)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : null;

  // Create new chat function
  const createNewChat = () => {
    console.log("Creating new chat");
  };

  const renderChatGroup = (chats, titleKey) => {
    if (chats.length === 0) return null;

    return (
      <div className="mt-4">
        <p className="px-2 py-1 text-xs text-dark400_light500">{t(titleKey)}</p>
        {chats.map((chat) => {
          const isActive = pathname === `/chat/${chat.id}`;
          const localizedTitle = getLocalizedChatTitle(chat, lng);

          const ChatLink = (
            <Link
              href={`/chat/${chat.id}`}
              className={cn(
                "block rounded-md px-3 py-2 my-1 text-sm hover:bg-light-700 dark:hover:bg-dark-300 transition-colors",
                isActive
                  ? "bg-primary-100 dark:bg-dark-300 text-primary-500 dark:text-light-900"
                  : "text-dark300_light900"
              )}
            >
              {localizedTitle}
            </Link>
          );

          return isMobileNav ? (
            <SheetClose asChild key={chat.id}>
              {ChatLink}
            </SheetClose>
          ) : (
            <React.Fragment key={chat.id}>{ChatLink}</React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full background-light850_dark100 text-dark100_light900 border-r light-border">
      {/* Fixed top section with new chat button */}
      <div className="sticky top-0 z-10 background-light850_dark100">
        <div className="flex items-center justify-between p-4">
          <button
            className="flex items-center justify-center rounded-md border light-border p-2 hover:bg-light-700 dark:hover:bg-dark-300 w-full transition-colors"
            onClick={createNewChat}
          >
            <Plus size={16} className="mr-2" />
            <span className="paragraph-medium">{t("chat.newChat")}</span>
          </button>
        </div>

        {/* Search bar */}
        <div className="relative px-4 pb-2">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-light-400 dark:text-light-500"
            />
            <input
              type="text"
              placeholder={t("chat.searchPlaceholder")}
              className="w-full rounded-md bg-light-800 dark:bg-dark-300 py-2 pl-10 pr-4 text-sm text-dark300_light900 placeholder no-focus"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Chat list - only this section has scrollbar */}
      <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
        {searchQuery ? (
          // Search results
          <div className="mt-4">
            <p className="px-2 py-1 text-xs text-dark400_light500">
              {t("chat.searchResults")}
            </p>
            {filteredChats?.map((chat) => {
              const isActive = pathname === `/chat/${chat.id}`;
              const localizedTitle = getLocalizedChatTitle(chat, lng);

              const ChatLink = (
                <Link
                  href={`/chat/${chat.id}`}
                  className={cn(
                    "block rounded-md px-3 py-2 my-1 text-sm hover:bg-light-700 dark:hover:bg-dark-300 transition-colors",
                    isActive
                      ? "bg-primary-100 dark:bg-dark-300 text-primary-500 dark:text-light-900"
                      : "text-dark300_light900"
                  )}
                >
                  {localizedTitle}
                </Link>
              );

              return isMobileNav ? (
                <SheetClose asChild key={chat.id}>
                  {ChatLink}
                </SheetClose>
              ) : (
                <React.Fragment key={chat.id}>{ChatLink}</React.Fragment>
              );
            })}
          </div>
        ) : (
          // Grouped chat history
          <>
            {renderChatGroup(yesterdayChats, "chat.yesterday")}
            {renderChatGroup(previousWeekChats, "chat.previousWeek")}
            {renderChatGroup(previousMonthChats, "chat.previousMonth")}
          </>
        )}
      </div>
    </div>
  );
};

export default NavLinks;
