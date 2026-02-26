"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Bookmark, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useWatchlistStore } from "@/store/watchlist";
import { useDebounce } from "@/hooks/use-debounce";

const navLinks = [
  { href: "/", label: "홈" },
  { href: "/movies", label: "영화" },
  { href: "/tv", label: "TV" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    pathname === "/search" ? searchParams.get("q") || "" : "",
  );
  const [isSearching, setIsSearching] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const watchlistCount = useWatchlistStore((s) => s.items.length);

  const urlQuery = pathname === "/search" ? searchParams.get("q") || "" : "";
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);

  const prevPathRef = useRef("/");
  const backTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedQuery = useDebounce(searchQuery, 400);

  useEffect(() => {
    if (pathname !== "/search") {
      prevPathRef.current = pathname;
    }
  }, [pathname]);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (pathname !== "/search" && searchQuery !== "") {
      setSearchQuery("");
      setIsSearching(false);
    }
  }

  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    if (isSearching && urlQuery === searchQuery.trim()) {
      setIsSearching(false);
    } else if (!isSearching && searchQuery !== urlQuery) {
      setSearchQuery(urlQuery);
    }
  }

  useEffect(() => {
    if (!debouncedQuery.trim() || !isSearching) return;
    const url = `/search?q=${encodeURIComponent(debouncedQuery.trim())}`;
    if (pathname === "/search") {
      router.replace(url, { scroll: false });
    } else {
      router.push(url);
    }
  }, [debouncedQuery, pathname, router, isSearching]);

  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    setIsSearching(true);

    if (backTimerRef.current) {
      clearTimeout(backTimerRef.current);
      backTimerRef.current = null;
    }

    if (!value.trim() && pathname === "/search") {
      backTimerRef.current = setTimeout(() => {
        router.push(prevPathRef.current || "/");
      }, 400);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 md:h-18 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center">
              <Image
                src="/text_logo.png"
                alt="Cinema"
                width={140}
                height={32}
                className="h-10 md:h-11 w-auto"
                priority
              />
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "rounded-md border px-3 py-2 text-base font-medium transition-colors",
                    pathname === href
                      ? "border-primary/40 bg-primary/15 text-primary"
                      : "border-transparent text-muted-foreground hover:text-primary",
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="영화, TV 검색..."
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  className="w-56 pl-9 bg-muted/50 border-border/50 focus:border-white/30 focus:bg-muted transition-all"
                />
              </div>
            </div>

            <Link href="/search" className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary"
              >
                <Search className="size-5" />
              </Button>
            </Link>

            <Link href="/watchlist">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-primary"
              >
                <Bookmark className="size-5 md:size-6" />
                {watchlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 text-[10px] font-bold flex items-center justify-center text-white">
                    {watchlistCount > 99 ? "99+" : watchlistCount}
                  </span>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-muted-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="size-5 md:size-6" />
              ) : (
                <Menu className="size-5 md:size-6" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 top-16 z-50 flex items-center justify-center animate-in fade-in duration-200"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
        >
          <nav className="flex flex-col items-center gap-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "text-2xl font-bold transition-colors pb-2 border-b-2",
                  pathname === href
                    ? "text-primary border-primary"
                    : "text-muted-foreground hover:text-primary border-transparent",
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
