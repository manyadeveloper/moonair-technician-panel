"use client";

import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useServiceData } from "@/providers/service-data-provider";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function getResultType(query: string, serviceNumber: string, serial?: string) {
  if (serviceNumber.toLowerCase().includes(query.toLowerCase())) {
    return "Service ID";
  }
  if (serial?.toLowerCase().includes(query.toLowerCase())) {
    return "Serial Number";
  }
  return "Service Request";
}

function SearchResults({
  query,
  onSelect,
}: {
  query: string;
  onSelect: () => void;
}) {
  const { globalSearch } = useServiceData();
  const results = query.trim().length >= 2 ? globalSearch(query).slice(0, 8) : [];

  if (query.trim().length < 2) return null;

  if (results.length === 0) {
    return <p className="px-4 py-3 text-sm text-muted">No results found.</p>;
  }

  return (
    <>
      <p className="border-b border-border px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted">
        Search results
      </p>
      <ul>
        {results.map((sr) => (
          <li key={sr.id}>
            <Link
              href={`/services/${sr.id}`}
              onClick={onSelect}
              className="block px-4 py-3 hover:bg-[#F9FAFB]"
            >
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted">
                {getResultType(
                  query,
                  sr.service_number,
                  sr.product?.serial_number
                )}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {sr.service_number}
              </p>
              <p className="text-xs text-secondary">{sr.customer?.name}</p>
              <p className="text-xs text-muted">
                {sr.product?.model_name}
                {sr.product?.serial_number
                  ? ` · ${sr.product.serial_number}`
                  : ""}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const closeAll = () => {
    setOpen(false);
    setMobileOpen(false);
    setQuery("");
  };

  return (
    <>
      <div ref={ref} className="relative hidden w-[min(100%,320px)] md:block">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-light" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search service ID, customer or serial number"
            className="h-10 pl-9"
            aria-label="Search service ID, customer or serial number"
          />
        </div>
        {open && query.trim().length >= 2 && (
          <div className="absolute top-full z-50 mt-1 w-full rounded-lg border border-border bg-card shadow-sm">
            <SearchResults query={query} onSelect={closeAll} />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="rounded-md p-2 text-muted hover:bg-[#F9FAFB] md:hidden"
        aria-label="Search"
      >
        <Search className="h-[18px] w-[18px]" />
      </button>

      <Modal
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Search"
        size="sm"
      >
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-light" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search service ID, customer or serial number"
            className="h-10 pl-9"
            autoFocus
          />
        </div>
        <SearchResults query={query} onSelect={closeAll} />
      </Modal>
    </>
  );
}
