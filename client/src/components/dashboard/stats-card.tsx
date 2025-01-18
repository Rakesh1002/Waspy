interface StatsCardProps {
  title: string;
  value: string | number;
  change: number;
  loading?: boolean;
}

export function StatsCard({ title, value, change, loading }: StatsCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-medium">{title}</h3>
        {loading ? (
          <div className="h-8 w-24 animate-pulse bg-muted rounded" />
        ) : (
          <>
            <div className="text-3xl font-bold">{value}</div>
            <p
              className={`text-sm ${change >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {change > 0 ? "+" : ""}
              {change}% from last month
            </p>
          </>
        )}
      </div>
    </div>
  );
}
