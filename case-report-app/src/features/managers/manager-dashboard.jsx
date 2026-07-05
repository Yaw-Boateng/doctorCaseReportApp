import React, { useState, useEffect } from "react";
import dashboardService from "@/lib/dashboardService";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, CheckCircle2, FileText, Activity, Trophy } from "lucide-react";
import { Loader } from "@/components/ui/loader";

// Accent colors for dynamic Pie mappings
const PIE_COLORS = ["#0ea5e9", "#eab308", "#ef4444", "#10b981", "#8b5cf6"];

export default function ManagerDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getDashboardMetrics();
        if (res?.success && res.data) {
          setMetrics(res.data);
        }
      } catch (error) {
        console.error(
          "Failed to fetch analytical operational data streams:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-background">
        <Loader message="Syncing Dashboard Matrices..." />
      </div>
    );
  }

  // Fallback to empty states if schema payload returns null
  const data = metrics || {};
  const revenueChartData = data.revenueChart || [];
  const testStatistics = data.testStatistics || [];
  const doctorReferrals = data.doctorReferrals || [];

  // Transform test analytics directly into standard key/pair formats for Pie layout compatibility
  const preparedPieData = testStatistics.map((item, index) => ({
    name: item.testName,
    value: item.totalCases,
    color: PIE_COLORS[index % PIE_COLORS.length],
  }));

  // Format currencies smoothly
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground p-2 sm:p-4 md:p-6 font-sans antialiased">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-5 mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            MANAGER DASHBOARD
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Review integrated operational pipelines across analytical nodes,
            financial streams, and medical staff resources.
          </p>
        </div>
      </div>

      {/* TOP KPI SUMMARY LAYER */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
            Total Doctors
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {data.totalDoctors || 0}
            </span>
            <Users className="h-4 w-4 text-emerald-500 opacity-60" />
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400">
            Active Doctors
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
              {data.activeDoctors || 0}
            </span>
            <CheckCircle2 className="h-4 w-4 text-blue-500 opacity-60" />
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-wider font-bold text-amber-600 dark:text-amber-500">
            Cases This Month
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-600 dark:text-amber-400">
              {data.totalCasesThisMonth || 0}
            </span>
            <Activity className="h-4 w-4 text-amber-500 opacity-60" />
          </div>
        </div>

        <div className="bg-teal-500/10 border border-teal-500/30 p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-wider font-bold text-teal-600 dark:text-teal-400">
            Tests This Month
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-teal-600 dark:text-teal-400">
              {data.totalTestsThisMonth || 0}
            </span>
            <FileText className="h-4 w-4 text-teal-400 opacity-60" />
          </div>
        </div>

        <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between col-span-2 sm:col-span-1 xl:col-span-1 shadow-sm">
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
            Total Revenue
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
              {formatCurrency(data.totalRevenue)}
            </span>
            <span className="h-4 w-4 text-sm font-semibold text-muted-foreground flex items-center justify-center font-sans select-none">
              ₵
            </span>
          </div>
        </div>

        <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between col-span-2 sm:col-span-1 xl:col-span-1 shadow-sm">
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
            Commission Paid
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
              {formatCurrency(data.totalCommissionPaid)}
            </span>
            <span className="h-4 w-4 text-sm font-semibold text-muted-foreground flex items-center justify-center font-sans select-none">
              ₵
            </span>
          </div>
        </div>
      </div>

      {/* CORE MATRIX CHART SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* PANEL 1: REVENUE & COMMISSION LINE CHART */}
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col min-h-[320px] shadow-sm md:col-span-2">
          <h2 className="text-xs uppercase font-bold tracking-wider text-muted-foreground mb-4">
            Financial Trends (Revenue vs Commission)
          </h2>
          <div className="flex-1 min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={revenueChartData}
                margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `$${v >= 1000 ? `${v / 1000}k` : v}`}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-foreground)",
                  }}
                />
                <Line
                  type="monotone"
                  name="Revenue"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  name="Commission"
                  dataKey="commission"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PANEL 2: TEST STATISTICS PIE DONUT */}
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col min-h-[320px] shadow-sm">
          <h2 className="text-xs uppercase font-bold tracking-wider text-muted-foreground mb-4">
            Test Allocation Statistics
          </h2>
          <div className="flex-1 flex items-center justify-center relative">
            {preparedPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={preparedPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {preparedPieData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      borderColor: "var(--color-border)",
                      color: "var(--color-foreground)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-muted-foreground">
                No test data reported
              </span>
            )}
          </div>
          <div className="max-h-[80px] overflow-y-auto grid grid-cols-2 gap-2 text-[11px] font-medium pt-3 border-t border-border mt-2">
            {preparedPieData.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 truncate">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground truncate">
                  {item.value} {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* PANEL 3: TOP REFERRING DOCTOR FEATURE */}
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between shadow-sm min-h-[280px]">
          <div>
            <h2 className="text-xs uppercase font-bold tracking-wider text-muted-foreground mb-4">
              Top Performing Practitioner
            </h2>
            {data.topReferringDoctor ? (
              <div className="relative overflow-hidden mt-2 p-5 rounded-xl text-center bg-primary/5 border border-primary/20">
  {/* Top Badge Accent */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-b-full" />

  {/* Trophy Icon */}
  <Trophy className="h-8 w-8 text-amber-500 mx-auto mb-2 opacity-95 animate-bounce [animation-duration:3s]" />
  
  {/* Doctor Name */}
  <span className="block text-sm font-black text-foreground tracking-tight mb-3">
    {data?.topReferringDoctor?.doctorName || "No Data Available"}
  </span>

  {/* Metrics Grid / Flex Wrapper */}
  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-xs mx-auto">
    
    {/* Commission Badge */}
    <div className="flex items-center justify-between sm:justify-start gap-2.5 px-3 py-1.5 w-full sm:w-auto rounded-lg bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/10 dark:border-blue-500/30 shadow-xs">
      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
        Commission
      </span>
      <span className="text-xs font-extrabold text-blue-700 dark:text-blue-300 font-mono">
        ₵{data?.topReferringDoctor?.totalCommission?.toLocaleString() || 0}
      </span>
    </div>

    {/* Revenue Badge */}
    <div className="flex items-center justify-between sm:justify-start gap-2.5 px-3 py-1.5 w-full sm:w-auto rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/10 dark:border-emerald-500/30 shadow-xs">
      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
        Revenue
      </span>
      <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 font-mono">
        ₵{data?.topReferringDoctor?.totalRevenue?.toLocaleString() || 0}
      </span>
    </div>

  </div>
</div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-8">
                No matching records available
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 border-t border-border pt-4 text-center text-xs">
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase">
                Cases (Year)
              </span>
              <span className="text-foreground font-bold font-mono text-sm mt-0.5 block">
                {data.topReferringDoctor?.totalCases || 0}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase">
                Tests (Year)
              </span>
              <span className="text-foreground font-bold font-mono text-sm mt-0.5 block">
                {data.topReferringDoctor?.totalTests || 0}
              </span>
            </div>
          </div>
        </div>

        {/* PANEL 4: DOCTOR REFERRALS VOLUME BAR CHART */}
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col min-h-[280px] shadow-sm md:col-span-2">
          <h2 className="text-xs uppercase font-bold tracking-wider text-muted-foreground mb-4">
            Doctor Activity Referrals Volume
          </h2>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={doctorReferrals}
                margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="doctorName"
                  stroke="var(--color-muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-foreground)",
                  }}
                />
                <Bar
                  name="Total Cases"
                  dataKey="totalCases"
                  fill="#0284c7"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
