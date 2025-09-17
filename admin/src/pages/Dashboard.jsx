// pages/Dashboard.jsx
import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiService from "@/services/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  Users,
  MessageSquareQuote,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = {
  primary: "hsl(var(--primary))",
  blue: "#60a5fa",
  purple: "#a78bfa",
  green: "#34d399",
  yellow: "#fbbf24",
  red: "#f87171",
  slate: "#94a3b8",
};

// Helpers
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const isSameDay = (a, b) => startOfDay(a).getTime() === startOfDay(b).getTime();

const getLastNDays = (n) => {
  const days = [];
  const today = startOfDay(new Date());
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }
  return days;
};

const countByDay = (items, field, days) =>
  days.map((d) => ({
    label: d.toLocaleDateString("en-US", { weekday: "short" }),
    date: d,
    count: items.filter((it) => isSameDay(new Date(it[field]), d)).length,
  }));

const weekSplit = (items, field) => {
  const today = startOfDay(new Date());
  const startThisWeek = new Date(today);
  startThisWeek.setDate(today.getDate() - 6);
  const startLastWeek = new Date(startThisWeek);
  startLastWeek.setDate(startLastWeek.getDate() - 7);
  const endLastWeek = new Date(startThisWeek);
  endLastWeek.setDate(endLastWeek.getDate() - 1);

  const inRange = (d, a, b) => {
    const x = startOfDay(new Date(d));
    return x >= startOfDay(a) && x <= startOfDay(b);
  };

  const thisWeek = items.filter((i) =>
    inRange(i[field], startThisWeek, today)
  ).length;
  const lastWeek = items.filter((i) =>
    inRange(i[field], startLastWeek, endLastWeek)
  ).length;

  const change =
    lastWeek === 0
      ? thisWeek > 0
        ? 100
        : 0
      : Math.round(((thisWeek - lastWeek) / lastWeek) * 100);

  return { thisWeek, lastWeek, change };
};

const Dashboard = () => {
  const queryClient = useQueryClient();
  const { data: subscriptionStats } = useQuery({
    queryKey: ["subscription-stats"],
    queryFn: () => apiService.getSubscriptionStats(),
  });

  // Fetch live data (admin endpoints for users, public for quotes)
  const {
    data: usersRes,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["dashboard-users"],
    queryFn: () => apiService.getUsers({ role: "all", status: "all" }),
  });

  const {
    data: quotesRes,
    isLoading: quotesLoading,
    error: quotesError,
  } = useQuery({
    queryKey: ["dashboard-quotes"],
    queryFn: () => apiService.getQuotes(),
  });

  const users = usersRes?.data || [];
  const quotes = quotesRes?.data || [];

  // Derived stats (no static)
  const totalUsers = users.length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;
  const activeUsers = users.filter((u) => u.isActive).length;

  const totalQuotes = quotes.length;
  const quotesByStatus = quotes.reduce(
    (acc, q) => {
      acc[q.status] = (acc[q.status] || 0) + 1;
      return acc;
    },
    { New: 0, "In Progress": 0, Resolved: 0, Closed: 0 }
  );

  // Chart: Users signups in last 7 days
  const days = getLastNDays(7);
  const signupsChart = countByDay(users, "createdAt", days);

  // Trends week-over-week
  const usersTrend = weekSplit(users, "createdAt");
  const quotesTrend = weekSplit(quotes, "createdAt");

  const isLoading = usersLoading || quotesLoading;
  const hasError = usersError || quotesError;

  const refetchAll = () => {
    queryClient.invalidateQueries({ queryKey: ["dashboard-users"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-quotes"] });
  };

  return (
    <div className="space-y-6">
      {/* Top */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gym Dashboard</h1>
          <p className="text-muted-foreground">
            Live overview of users and quotes
          </p>
        </div>
        <Button variant="outline" onClick={refetchAll}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={totalUsers}
          sub={`${activeUsers} active • ${totalAdmins} admins`}
          icon={<Users className="h-5 w-5 text-muted-foreground" />}
          trend={usersTrend.change}
          loading={isLoading}
        />
        <StatCard
          title="New Users (7d)"
          value={usersTrend.thisWeek}
          sub={`Last week: ${usersTrend.lastWeek}`}
          icon={<ArrowUpRight className="h-5 w-5 text-green-600" />}
          trend={usersTrend.change}
          loading={isLoading}
        />
        <StatCard
          title="Total Quotes"
          value={totalQuotes}
          sub={`New: ${quotesByStatus["New"] ?? 0} • In Progress: ${
            quotesByStatus["In Progress"] ?? 0
          }`}
          icon={
            <MessageSquareQuote className="h-5 w-5 text-muted-foreground" />
          }
          trend={quotesTrend.change}
          loading={isLoading}
        />
        <StatCard
          title="Resolved (7d)"
          value={
            quotes.filter((q) =>
              isSameDay(new Date(q.updatedAt || q.createdAt), new Date())
            ).length
          }
          sub={`Resolved total: ${quotesByStatus["Resolved"] ?? 0}`}
          icon={<ArrowDownRight className="h-5 w-5 text-purple-600" />}
          trend={quotesTrend.change}
          loading={isLoading}
        />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptionStats?.activeSubscriptions || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{subscriptionStats?.totalRevenue || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts + Status donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly User Signups</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <SkeletonChart />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={signupsChart}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))" }}
                    contentStyle={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    formatter={(val) => [`${val}`, "Signups"]}
                  />
                  <Bar
                    dataKey="count"
                    fill={COLORS.primary}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quotes by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <SkeletonDonut />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "New",
                        value: quotesByStatus["New"] ?? 0,
                        color: COLORS.blue,
                      },
                      {
                        name: "In Progress",
                        value: quotesByStatus["In Progress"] ?? 0,
                        color: COLORS.yellow,
                      },
                      {
                        name: "Resolved",
                        value: quotesByStatus["Resolved"] ?? 0,
                        color: COLORS.green,
                      },
                      {
                        name: "Closed",
                        value: quotesByStatus["Closed"] ?? 0,
                        color: COLORS.red,
                      },
                    ]}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    stroke="transparent"
                  >
                    {["New", "In Progress", "Resolved", "Closed"].map(
                      (s, i) => (
                        <Cell
                          key={s}
                          fill={
                            [
                              COLORS.blue,
                              COLORS.yellow,
                              COLORS.green,
                              COLORS.red,
                            ][i]
                          }
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            {!isLoading && (
              <div className="mt-4 flex flex-wrap gap-2">
                <LegendDot
                  color={COLORS.blue}
                  label={`New (${quotesByStatus["New"] ?? 0})`}
                />
                <LegendDot
                  color={COLORS.yellow}
                  label={`In Progress (${quotesByStatus["In Progress"] ?? 0})`}
                />
                <LegendDot
                  color={COLORS.green}
                  label={`Resolved (${quotesByStatus["Resolved"] ?? 0})`}
                />
                <LegendDot
                  color={COLORS.red}
                  label={`Closed (${quotesByStatus["Closed"] ?? 0})`}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(users || [])
                  .slice()
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 5)
                  .map((u) => (
                    <TableRow key={u._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={u.avatar} />
                            <AvatarFallback>
                              {u.fullname?.[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{u.fullname}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {u.email}
                      </TableCell>
                      <TableCell>{formatDate(u.createdAt)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Quotes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(quotes || [])
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 6)
              .map((q) => (
                <div key={q._id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{q.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(q.createdAt)}
                    </p>
                  </div>
                  <Badge variant="outline">{q.status}</Badge>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {hasError && (
        <div className="text-red-500 text-sm">
          Some sections failed to load. Try refreshing.
        </div>
      )}
    </div>
  );
};

// Small components
const StatCard = ({ title, value, sub, icon, trend, loading }) => (
  <Card className="overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      {loading ? (
        <div className="space-y-2">
          <div className="h-7 w-24 bg-muted animate-pulse rounded" />
          <div className="h-3 w-40 bg-muted animate-pulse rounded" />
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold">{value}</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            {typeof trend === "number" && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                  trend >= 0
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {trend >= 0 ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {Math.abs(trend)}%
              </span>
            )}
            <span>{sub}</span>
          </div>
        </>
      )}
    </CardContent>
  </Card>
);

const SkeletonChart = () => (
  <div className="h-full w-full flex items-end gap-3 px-4">
    {[...Array(7)].map((_, i) => (
      <div
        key={i}
        className="flex-1 bg-muted animate-pulse rounded-t"
        style={{ height: `${30 + i * 8}px` }}
      />
    ))}
  </div>
);

const SkeletonDonut = () => (
  <div className="h-full w-full flex items-center justify-center">
    <div className="h-40 w-40 rounded-full bg-muted animate-pulse" />
  </div>
);

const LegendDot = ({ color, label }) => (
  <div className="flex items-center gap-2 text-sm text-muted-foreground">
    <span
      className="inline-block h-3 w-3 rounded-full"
      style={{ backgroundColor: color }}
    />
    {label}
  </div>
);

export default Dashboard;
