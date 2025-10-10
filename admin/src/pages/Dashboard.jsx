// pages/Dashboard.jsx
import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import apiService from "@/services/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  RefreshCw,
  CreditCard,
  DollarSign,
  AlertCircle,
  TrendingUp,
  BarChart2,
  Dumbbell,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const COLORS = {
  primary: "hsl(var(--primary))",
  green: "#34d399",
  orange: "#fbbf24",
  red: "#f87171",
  blue: "#60a5fa",
  purple: "#a78bfa",
};

// Helpers
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

const Dashboard = () => {
  const queryClient = useQueryClient();

  // Fetch all data
  const { data: dashboardData, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => apiService.getDashboardStats(),
  });

  const { data: subscriptionStats, isLoading: subStatsLoading } = useQuery({
    queryKey: ["subscription-stats"],
    queryFn: () => apiService.getSubscriptionStats(),
  });

  const { data: recentSubscriptions, isLoading: subsLoading } = useQuery({
    queryKey: ["recent-subscriptions"],
    queryFn: () => apiService.getSubscriptions({ limit: 5 }),
  });

  const isLoading = statsLoading || subStatsLoading || subsLoading;

  const stats = dashboardData?.data || {};
  const subStats = subscriptionStats?.data || {};
  const recentSubs = recentSubscriptions?.data || [];

  const refetchAll = () => {
    queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    queryClient.invalidateQueries({ queryKey: ["subscription-stats"] });
    queryClient.invalidateQueries({ queryKey: ["recent-subscriptions"] });
  };

  // Prepare chart data
  const revenueData = useMemo(() => {
    // Replace with real data when API is ready
    return [
      { name: "Jan", revenue: 4000 },
      { name: "Feb", revenue: 3000 },
      { name: "Mar", revenue: 5000 },
      { name: "Apr", revenue: 4500 },
      { name: "May", revenue: 6000 },
      { name: "Jun", revenue: 5500 },
    ];
  }, []);

  const planDistribution = useMemo(() => {
    if (!recentSubs || recentSubs.length === 0) return [];

    const counts = recentSubs.reduce((acc, sub) => {
      const planName = sub.planId?.name || "Unknown";
      acc[planName] = (acc[planName] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [recentSubs]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gym Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Admin! Here's your gym's performance snapshot.
          </p>
        </div>
        <Button variant="outline" onClick={refetchAll} disabled={isLoading}>
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(subStats.totalRevenue || 0)}
          sub={`Avg. value: ${formatCurrency(subStats.avgValue || 0)}`}
          icon={<DollarSign className="h-5 w-5 text-green-600" />}
          loading={isLoading}
        />
        <StatCard
          title="Active Members"
          value={subStats.activeSubscriptions || 0}
          sub={`${subStats.newThisMonth || 0} new this month`}
          icon={<Users className="h-5 w-5 text-blue-600" />}
          loading={isLoading}
        />
        <StatCard
          title="Memberships Expiring"
          value={subStats.expiringSoon || 0}
          sub="In next 7 days"
          icon={<AlertCircle className="h-5 w-5 text-orange-600" />}
          loading={isLoading}
        />
        <StatCard
          title="Total Trainers"
          value={stats.totalTrainers || 0}
          sub="Ready to assist"
          icon={<Dumbbell className="h-5 w-5 text-purple-600" />}
          loading={isLoading}
        />
      </div>

      {/* Revenue Chart & Plan Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
            <CardDescription>
              Revenue generated from subscriptions over the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <SkeletonChart />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `₹${val / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    formatter={(val) => [formatCurrency(val), "Revenue"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke={COLORS.primary}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
            <CardDescription>
              Popularity of plans among recent subscriptions.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <SkeletonDonut />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[["green", "blue", "orange"][index % 3]]}
                      />
                    ))}
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
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Newest Members</CardTitle>
            <CardDescription>Recently joined members.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <SkeletonTable />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Start Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSubs.map((sub) => (
                    <TableRow key={sub._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={sub.userId?.avatar} />
                            <AvatarFallback>
                              {sub.userId?.fullname?.[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {sub.userId?.fullname}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{sub.planId?.name}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(sub.startDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <div className="text-right mt-4">
              <Button asChild variant="link">
                <Link to="/subscriptions">View All Subscriptions</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Quotes</CardTitle>
            <CardDescription>
              New inquiries from potential members.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <SkeletonList />
            ) : (
              stats.recentActivity?.quotes?.slice(0, 5).map((q) => (
                <div key={q._id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{q.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(q.createdAt)}
                    </p>
                  </div>
                  <Badge variant={q.status === "New" ? "default" : "outline"}>
                    {q.status}
                  </Badge>
                </div>
              ))
            )}
            <div className="text-right mt-4">
              <Button asChild variant="link">
                <Link to="/quotes">View All Quotes</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Small helper components
const StatCard = ({ title, value, sub, icon, loading }) => (
  <Card>
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
          <p className="text-xs text-muted-foreground mt-1">{sub}</p>
        </>
      )}
    </CardContent>
  </Card>
);

const SkeletonTable = () => (
  <div className="space-y-2">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-10 w-full bg-muted animate-pulse rounded" />
    ))}
  </div>
);

const SkeletonList = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-8 w-full bg-muted animate-pulse rounded" />
    ))}
  </div>
);

const SkeletonChart = () => (
  <div className="h-full w-full bg-muted animate-pulse rounded-lg" />
);

const SkeletonDonut = () => (
  <div className="h-full w-full flex items-center justify-center">
    <div className="h-40 w-40 rounded-full bg-muted animate-pulse" />
  </div>
);

export default Dashboard;
