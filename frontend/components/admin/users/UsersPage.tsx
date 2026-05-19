"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Eye, Search, ShieldBan, ShieldCheck, X } from "lucide-react";
import {
  AdminCard,
  AdminModalFrame,
  AdminPageHeader,
  AdminPageShell,
  AdminToolbar,
} from "@/components/admin/AdminPage";
import Badge from "@/components/ui/Badge";
import { Table, TableEmpty, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { userService } from "@/services/userService";
import type { User } from "@/types/user";

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<User | null>(null);
  const [openView, setOpenView] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastSearch = useRef("");

  const fetchData = async (pageNum = 1) => {
    setPageLoading(true);
    try {
      const res = await userService.getAll(pageNum, "student");
      const users = Array.isArray(res.data) ? res.data : [];
      setData(users);
      setPage(res.meta?.current_page ?? pageNum);
      setLastPage(res.meta?.last_page ?? 1);
      setTotal(res.meta?.total ?? users.length);
    } catch {
      toast.error("Failed to fetch students.");
      setData([]);
    } finally {
      setPageLoading(false);
      setHasLoaded(true);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const handleSearch = async (value: string) => {
    setPageLoading(true);
    try {
      const res = await userService.search(value);
      setData(Array.isArray(res.data) ? res.data : []);
      setLastPage(1);
      setTotal(Array.isArray(res.data) ? res.data.length : 0);
      setPage(1);
    } catch {
      toast.error("Failed to fetch results.");
      setData([]);
    } finally {
      setPageLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    const trimmed = value.trim();

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      if (trimmed.length < 2) {
        lastSearch.current = "";
        fetchData(1);
        return;
      }
      if (trimmed === lastSearch.current) return;
      lastSearch.current = trimmed;
      handleSearch(trimmed);
    }, 400);
  };

  const toggleBlock = async (id: number) => {
    try {
      await userService.toggleBlock(id);
      const update = (users: User[]) =>
        users.map((u) => (u.id === id ? { ...u, is_blocked: !u.is_blocked } : u));
      setData(update);
      toast.success("Updated");
    } catch {
      toast.error("Error");
    }
  };

  const handleNext = async () => {
    if (pageLoading || page >= lastPage || search.trim().length >= 2) return;
    await fetchData(page + 1);
  };

  const handlePrev = async () => {
    if (page <= 1 || pageLoading || search.trim().length >= 2) return;
    await fetchData(page - 1);
  };

  const isEmpty = hasLoaded && !pageLoading && data.length === 0;

  return (
    <AdminPageShell>
      <AdminPageHeader
        eyebrow="People"
        title="Students"
        description="Review student accounts, search records, and manage blocked access."
      />

      <AdminToolbar>
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search students..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                lastSearch.current = "";
                fetchData(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {search.trim().length >= 2
            ? `Showing ${data.length} search result${data.length === 1 ? "" : "s"}`
            : `Showing ${data.length} of ${total} students`}
        </div>
      </AdminToolbar>

      <AdminCard>
        {pageLoading ? (
          <div className="space-y-3 p-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4 border-b border-gray-100 p-4 animate-pulse">
                <div className="h-4 w-32 rounded bg-gray-200" />
                <div className="h-4 w-28 rounded bg-gray-200" />
                <div className="h-4 w-40 rounded bg-gray-200" />
                <div className="h-4 w-20 rounded bg-gray-200" />
                <div className="ml-auto h-4 w-24 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <THead className="bg-gray-50 text-gray-600">
              <TR>
                <TH>Name</TH>
                <TH>Username</TH>
                <TH>Email</TH>
                <TH>Status</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {isEmpty ? (
                <TableEmpty colSpan={5}>No students found.</TableEmpty>
              ) : (
                data.map((u) => (
                  <TR key={u.id} className="hover:bg-brand-50/40">
                    <TD className="font-medium text-gray-900">{u.name}</TD>
                    <TD className="text-gray-600">{u.username}</TD>
                    <TD className="text-gray-600">{u.email}</TD>
                    <TD>
                      <Badge variant={u.is_blocked ? "danger" : "success"}>
                        {u.is_blocked ? "Blocked" : "Active"}
                      </Badge>
                    </TD>
                    <TD>
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelected(u);
                            setOpenView(true);
                          }}
                          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-brand-50 hover:text-brand-700"
                          aria-label={`View ${u.name}`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleBlock(u.id)}
                          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                          aria-label={u.is_blocked ? `Unblock ${u.name}` : `Block ${u.name}`}
                        >
                          {u.is_blocked ? (
                            <ShieldCheck className="h-4 w-4 text-green-600" />
                          ) : (
                            <ShieldBan className="h-4 w-4 text-red-600" />
                          )}
                        </button>
                      </div>
                    </TD>
                  </TR>
                ))
              )}
            </TBody>
          </Table>
        )}

        <div className="flex items-center justify-between border-t border-gray-200 p-4">
          <button
            onClick={handlePrev}
            disabled={page === 1 || pageLoading || search.trim().length >= 2}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {lastPage}
          </span>
          <button
            onClick={handleNext}
            disabled={pageLoading || page >= lastPage || search.trim().length >= 2}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </AdminCard>

      {openView && selected && (
        <AdminModalFrame className="max-w-lg p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Student Details</h2>
          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            {[
              ["Name", selected.name],
              ["Email", selected.email],
              ["Username", selected.username],
              ["Phone", selected.phone || "N/A"],
              ["School", selected.school || "N/A"],
              ["Grade", selected.grade || "N/A"],
              ["Status", selected.is_blocked ? "Blocked" : "Active"],
              ["Premium", selected.is_premium ? "Yes" : "No"],
              ["Preferred Language", selected.preferred_language || "N/A"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <dt className="text-xs font-medium text-gray-500">{label}</dt>
                <dd className="mt-1 font-medium text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
          <button
            onClick={() => setOpenView(false)}
            className="mt-5 w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Close
          </button>
        </AdminModalFrame>
      )}
    </AdminPageShell>
  );
}
