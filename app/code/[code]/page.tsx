// app/code/[code]/page.tsx

export default async function StatsPage({ params }: any) {
  const code = params.code;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/links/${code}`,
    { cache: "no-store" }
  );

  if (res.status === 404) {
    return <div className="text-red-600">Link not found.</div>;
  }

  const data = await res.json();

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">
        Stats for <span className="font-mono">{code}</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <strong>Target URL</strong>
          <div className="mt-1 break-all">
            <a href={data.url} className="text-sky-600">
              {data.url}
            </a>
          </div>
        </div>

        <div>
          <strong>Total Clicks</strong>
          <div className="mt-1">{data.clicks}</div>
        </div>

        <div>
          <strong>Last Clicked</strong>
          <div className="mt-1">
            {data.last_clicked
              ? new Date(data.last_clicked).toLocaleString()
              : "Never"}
          </div>
        </div>

        <div>
          <strong>Created At</strong>
          <div className="mt-1">
            {new Date(data.created_at).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
