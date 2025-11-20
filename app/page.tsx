// app/page.tsx
"use client";

import { useEffect, useState } from "react";

type LinkRow = {
  code: string;
  url: string;
  clicks: number;
  last_clicked: string | null;
  created_at: string;
};

export default function Dashboard() {
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    const r = await fetch("/api/links");
    const data = await r.json();
    setLinks(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function createLink(e: any) {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        code: code || undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Unable to create link");
      return;
    }

    setUrl("");
    setCode("");
    load();
  }

  async function deleteLink(c: string) {
    const ok = confirm(`Delete link ${c}?`);
    if (!ok) return;

    await fetch(`/api/links/${c}`, { method: "DELETE" });
    load();
  }

  const filtered = links.filter(
    (l) =>
      l.code.toLowerCase().includes(search.toLowerCase()) ||
      l.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Add form */}
      <div className="mb-6">
        <form
          onSubmit={createLink}
          className="grid grid-cols-1 md:grid-cols-4 gap-2"
        >
          <input
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/my-long-url"
            className="col-span-3 p-2 border rounded"
          />

          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Custom code (6–8 chars)"
            className="p-2 border rounded"
          />

          <div className="md:col-span-4 mt-1 flex gap-2">
            <button className="px-4 py-2 bg-sky-600 text-white rounded">
              Create
            </button>
            {error && <div className="text-red-600">{error}</div>}
          </div>
        </form>
      </div>

      {/* Search */}
      <div className="mb-4 flex justify-between items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code or URL"
          className="p-2 border rounded w-64"
        />
        <span className="text-sm text-gray-500">
          Total: {links.length}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-xs text-gray-500 uppercase">
            <tr>
              <th className="p-3">Code</th>
              <th className="p-3">Target URL</th>
              <th className="p-3">Clicks</th>
              <th className="p-3">Last Clicked</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="p-4" colSpan={5}>
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td className="p-4" colSpan={5}>
                  No links found.
                </td>
              </tr>
            ) : (
              filtered.map((link) => (
                <tr key={link.code} className="border-t">
                  <td className="p-3">
                    <div className="font-mono">{link.code}</div>
                    <a
                      href={`/code/${link.code}`}
                      className="text-xs text-sky-600"
                    >
                      Stats
                    </a>
                  </td>

                  <td className="p-3">
                    <div className="truncate-ellipsis max-w-md">
                      {link.url}
                    </div>
                  </td>

                  <td className="p-3">{link.clicks}</td>

                  <td className="p-3">
                    {link.last_clicked
                      ? new Date(link.last_clicked).toLocaleString()
                      : "Never"}
                  </td>

                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 border rounded"
                        onClick={() => {
                          const finalUrl =
                            (process.env.NEXT_PUBLIC_BASE_URL ||
                              window.location.origin) +
                            "/" +
                            link.code;

                          navigator.clipboard?.writeText(finalUrl);
                          alert("Copied!");
                        }}
                      >
                        Copy
                      </button>

                      <button
                        className="px-3 py-1 border rounded text-red-600"
                        onClick={() => deleteLink(link.code)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
