import { Card, CardContent } from "@/components/ui/card";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "bg-blue-600",
}) {
  return (
    <Card className="surface-card overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color} text-white shadow-lg`}
        >
          <Icon size={28} />
        </div>
      </CardContent>
    </Card>
  );
}
