"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Film, Tv, Bookmark, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useWatchlistStore } from "@/store/watchlist";
import { useDebounce } from "@/hooks/use-debounce";

const navLinks = [
  { href: "/", label: "홈" },
  { href: "/movies", label: "영화", icon: Film },
  { href: "/tv", label: "TV", icon: Tv },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    pathname === "/search" ? (searchParams.get("q") || "") : ""
  );
  const [isSearching, setIsSearching] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const watchlistCount = useWatchlistStore((s) => s.items.length);

  const urlQuery = pathname === "/search" ? (searchParams.get("q") || "") : "";
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
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Film className="h-6 w-6 text-red-500" />
            <span className="text-white">Cinema</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === href
                    ? "text-white bg-white/10"
                    : "text-muted-foreground hover:text-white"
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
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
              <Search className="h-5 w-5" />
            </Button>
          </Link>

          <Link href="/watchlist">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-white">
              <Bookmark className="h-5 w-5" />
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
            className="md:hidden text-muted-foreground hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

    </header>

    {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 flex items-center justify-center animate-in fade-in duration-200" style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}>
        <nav className="flex flex-col items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "text-2xl font-bold transition-colors pb-2 border-b-2",
                  pathname === href
                    ? "text-white border-white"
                    : "text-muted-foreground hover:text-white border-transparent"
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
