import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Chart from "react-apexcharts";
import { widgetService } from "@/services/api/widgetService";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
export default function AdminWidgetAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [timePeriod, setTimePeriod] = useState("30d");

  useEffect(() => {
    loadAnalytics();
  }, [timePeriod]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await widgetService.getAnalytics(timePeriod);
      setAnalyticsData(data);
    } catch (err) {
      setError("Failed to load analytics data");
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const timePeriodOptions = [
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "90d", label: "Last 90 Days" },
    { value: "all", label: "All Time" }
  ];

  // Chart configurations
const installationChartOptions = {
    chart: {
      type: "area",
      height: 300,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 3
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2
      }
    },
    colors: ["#6366F1"],
    xaxis: {
      categories: analyticsData?.trends.dates || [],
      labels: {
        rotate: -45,
        style: { fontSize: "12px" }
      }
    },
    yaxis: {
      title: { text: "Installations" }
    },
    grid: {
      borderColor: "#e5e7eb"
    },
    tooltip: {
      x: { format: "dd MMM yyyy" }
    }
  };

  const submissionChartOptions = {
    chart: {
      type: "bar",
      height: 300,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "60%"
      }
    },
    dataLabels: { enabled: false },
    colors: ["#10B981"],
    xaxis: {
      categories: analyticsData?.byWidget.map(w => w.name) || [],
      labels: {
        rotate: -45,
        style: { fontSize: "12px" }
      }
    },
    yaxis: {
      title: { text: "Submissions" }
    },
    grid: {
      borderColor: "#e5e7eb"
    }
  };

  const geographyChartOptions = {
    chart: {
      type: "donut",
      height: 320
    },
    labels: analyticsData?.geography.map(g => g.country) || [],
    colors: ["#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#EF4444", "#6B7280"],
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Users",
              fontSize: "16px",
              fontWeight: 600,
              color: "#374151"
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val) {
        return val.toFixed(1) + "%";
      }
    },
    legend: {
      position: "bottom",
      fontSize: "14px",
      fontWeight: 500,
      markers: {
        width: 12,
        height: 12,
        radius: 3
      }
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return val + " users";
        }
      }
    }
  };

  const deviceChartOptions = {
    chart: {
      type: "radialBar",
      height: 320
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: "30%",
          background: "transparent"
        },
        dataLabels: {
          name: {
            fontSize: "16px",
            fontWeight: 600,
            offsetY: -10
          },
          value: {
            fontSize: "14px",
            offsetY: 5,
            formatter: function(val) {
              return val + "%";
            }
          }
        }
      }
    },
    colors: ["#6366F1", "#10B981", "#F59E0B"],
    labels: ["Desktop", "Mobile", "Tablet"],
    legend: {
      show: true,
      position: "bottom",
      fontSize: "14px",
      fontWeight: 500,
      markers: {
        width: 12,
        height: 12,
        radius: 3
      }
    }
  };

  const getConversionRateColor = (rate) => {
    if (rate >= 10) return "text-green-600 bg-green-50";
    if (rate >= 5) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getConversionRateIcon = (rate) => {
    if (rate >= 10) return "TrendingUp";
    if (rate >= 5) return "Minus";
    return "TrendingDown";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAnalytics} />;
  if (!analyticsData) return <Error message="No analytics data available" onRetry={loadAnalytics} />;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Widget Analytics</h1>
            <p className="text-gray-600 mt-2">
              Track widget installations, submissions, and conversion rates
            </p>
          </div>
          <div className="flex gap-2">
            {timePeriodOptions.map(option => (
              <Button
                key={option.value}
                onClick={() => setTimePeriod(option.value)}
                variant={timePeriod === option.value ? "primary" : "secondary"}
                size="sm"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
<div className="max-w-7xl mx-auto px-8 py-8 space-y-6">
          {/* Key Metrics */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Total Installations */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <ApperIcon name="Download" size={24} className="text-indigo-600" />
                </div>
                <span className="text-xs font-medium text-gray-500 uppercase">Total</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {analyticsData.summary.totalInstallations.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-600">Widget Installations</p>
            </div>

            {/* Total Submissions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <ApperIcon name="MessageSquare" size={24} className="text-green-600" />
                </div>
                <span className="text-xs font-medium text-gray-500 uppercase">Total</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {analyticsData.summary.totalSubmissions.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-600">Form Submissions</p>
            </div>

            {/* Conversion Rate */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-lg", getConversionRateColor(analyticsData.summary.conversionRate))}>
                  <ApperIcon 
                    name={getConversionRateIcon(analyticsData.summary.conversionRate)} 
                    size={24} 
                  />
                </div>
                <span className="text-xs font-medium text-gray-500 uppercase">Average</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {analyticsData.summary.conversionRate}%
              </h3>
              <p className="text-sm text-gray-600">Conversion Rate</p>
            </div>
          </div>

          {/* Installation Trend Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Installation Trend</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span>Installations over time</span>
              </div>
            </div>
            <Chart
              options={installationChartOptions}
              series={[{
                name: "Installations",
                data: analyticsData.trends.installations
              }]}
              type="area"
              height={300}
            />
          </div>

          {/* Submissions by Widget */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Submissions by Widget</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Total submissions per widget</span>
              </div>
            </div>
            <Chart
              options={submissionChartOptions}
              series={[{
                name: "Submissions",
                data: analyticsData.byWidget.map(w => w.submissions)
              }]}
              type="bar"
              height={300}
            />
          </div>
{/* Popular Pages */}
          <div className="bg-white rounded-xl p-6 shadow-card">
            <div className="flex items-center gap-2 mb-6">
              <ApperIcon name="BarChart3" size={20} className="text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Popular Pages</h3>
            </div>
            <div className="space-y-3">
              {analyticsData.popularPages.map((page, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">{page.url}</span>
                    <span className="text-gray-600">{page.views.toLocaleString()} views</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${page.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 text-right">{page.percentage}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-card">
            <div className="flex items-center gap-2 mb-6">
              <ApperIcon name="Globe" size={20} className="text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Geographic Distribution</h3>
            </div>
            <Chart
              options={geographyChartOptions}
              series={analyticsData.geography.map(g => g.users)}
              type="donut"
              height={320}
            />
          </div>

          {/* Device Breakdown */}
          <div className="bg-white rounded-xl p-6 shadow-card">
            <div className="flex items-center gap-2 mb-6">
              <ApperIcon name="Smartphone" size={20} className="text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Device Breakdown</h3>
            </div>
            <Chart
              options={deviceChartOptions}
              series={[
                analyticsData.devices.desktop,
                analyticsData.devices.mobile,
                analyticsData.devices.tablet
              ]}
              type="radialBar"
              height={320}
            />
          </div>

          {/* Widget Performance Table */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Widget Performance Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Widget Name</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Installations</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Submissions</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Conversion Rate</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.byWidget.map(widget => (
                    <tr key={widget.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">{widget.name}</td>
                      <td className="py-4 px-4 text-sm text-right text-gray-700">
                        {widget.installations.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-sm text-right text-gray-700">
                        {widget.submissions.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-sm text-right font-semibold text-gray-900">
                        {widget.conversionRate}%
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium",
                          getConversionRateColor(parseFloat(widget.conversionRate))
                        )}>
                          <ApperIcon 
                            name={getConversionRateIcon(parseFloat(widget.conversionRate))} 
                            size={14} 
                          />
                          {parseFloat(widget.conversionRate) >= 10 ? "Excellent" : 
                           parseFloat(widget.conversionRate) >= 5 ? "Good" : "Needs Improvement"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex gap-3">
              <ApperIcon name="Info" size={20} className="text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">About Conversion Rates</h4>
                <p className="text-sm text-blue-800 mb-2">
                  Conversion rate measures the percentage of widget installations that result in feedback submissions.
                </p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>Excellent (≥10%):</strong> High user engagement and effective widget placement</li>
                  <li>• <strong>Good (5-10%):</strong> Decent engagement, room for optimization</li>
                  <li>• <strong>Needs Improvement (&lt;5%):</strong> Consider adjusting widget visibility or messaging</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}