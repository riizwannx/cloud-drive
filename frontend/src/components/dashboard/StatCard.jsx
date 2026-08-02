import { Card, CardContent } from "@/components/ui/card";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "bg-blue-600",
}) {
  return (
    <Card className="rounded-2xl shadow-sm border hover:shadow-md transition-all duration-300">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-sm text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color} text-white`}
        >
          <Icon size={28} />
        </div>
      </CardContent>
    </Card>
  );
}