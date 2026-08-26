import { memo } from "react";

import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";

// =====================================================
// HELPERS
// =====================================================

const formatCurrency = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-PK")}`;

const formatCompactCurrency = (value) => {
  const number = Number(value || 0);

  if (number >= 1000000) {
    return `Rs. ${(number / 1000000).toFixed(1)}M`;
  }

  if (number >= 1000) {
    return `Rs. ${(number / 1000).toFixed(1)}K`;
  }

  return `Rs. ${number.toLocaleString("en-PK")}`;
};

// =====================================================
// SHARED NIVO THEME
// =====================================================

const chartTheme = {
  text: {
    fontSize: 11,
    fill: "#6b7280",
  },

  axis: {
    domain: {
      line: {
        stroke: "#e5e7eb",
        strokeWidth: 1,
      },
    },

    ticks: {
      line: {
        stroke: "transparent",
      },

      text: {
        fill: "#9ca3af",
        fontSize: 11,
      },
    },

    legend: {
      text: {
        fill: "#6b7280",
        fontSize: 11,
        fontWeight: 500,
      },
    },
  },

  grid: {
    line: {
      stroke: "#f1f3f5",
      strokeWidth: 1,
    },
  },

  crosshair: {
    line: {
      stroke: "#c4b5fd",
      strokeWidth: 1,
      strokeOpacity: 0.7,
      strokeDasharray: "4 4",
    },
  },

  tooltip: {
    container: {
      background: "#ffffff",
      color: "#111827",
      fontSize: 12,
      borderRadius: "12px",
      boxShadow:
        "0 12px 30px rgba(15, 23, 42, 0.10)",
    },
  },
};

// =====================================================
// CARD HEADER
// =====================================================

const ChartHeader = ({
  title,
  description,
  color,
  rightContent,
}) => {
  return (
    <div className="px-5 sm:px-6 py-5 border-b border-gray-100">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${color}`}
            />

            <h2 className="font-semibold text-gray-900">
              {title}
            </h2>
          </div>

          <p className="text-xs text-gray-500 mt-1.5">
            {description}
          </p>
        </div>

        {rightContent}
      </div>
    </div>
  );
};

// =====================================================
// EMPTY CHART
// =====================================================

const EmptyChart = ({ message }) => {
  return (
    <div className="h-full flex items-center justify-center px-5">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
        </div>

        <p className="text-sm font-medium text-gray-500 mt-4">
          {message}
        </p>

        <p className="text-xs text-gray-400 mt-1">
          Data will appear here once records are available.
        </p>
      </div>
    </div>
  );
};

// =====================================================
// MAIN COMPONENT
// =====================================================

const DashboardCharts = memo(
  ({
    salesTrendData = [],
    stockDistributionData = [],
    paymentMethodData = [],
    revenueCostData = [],
    topSellingProductsData = [],
  }) => {
    // =================================================
    // SALES TOTAL
    // =================================================

    const salesTotal =
      salesTrendData?.[0]?.data?.reduce(
        (total, item) =>
          total + Number(item.y || 0),
        0
      ) || 0;

    // =================================================
    // STOCK TOTAL
    // =================================================

    const stockTotal =
      stockDistributionData.reduce(
        (total, item) =>
          total + Number(item.value || 0),
        0
      );

    // =================================================
    // PAYMENT TOTAL
    // =================================================

    const paymentTotal =
      paymentMethodData.reduce(
        (total, item) =>
          total + Number(item.amount || 0),
        0
      );

    return (
      <div className="mt-6 space-y-6">

        {/* =================================================
            1. SALES PERFORMANCE
        ================================================= */}

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

          <ChartHeader
            title="Sales Performance"
            description="Revenue generated from recent sales"
            color="bg-purple-500"
            rightContent={
              <div className="text-right shrink-0">

                <p className="text-xs text-gray-400">
                  Recent Revenue
                </p>

                <p className="text-lg font-semibold text-gray-900 mt-0.5">
                  {formatCurrency(salesTotal)}
                </p>

              </div>
            }
          />

          <div className="h-[340px] sm:h-[370px] px-1 sm:px-3 py-3">

            {salesTrendData?.[0]?.data?.length > 0 ? (

              <ResponsiveLine
                data={salesTrendData}

                margin={{
                  top: 20,
                  right: 24,
                  bottom: 48,
                  left: 68,
                }}

                xScale={{
                  type: "point",
                }}

                yScale={{
                  type: "linear",
                  min: 0,
                  max: "auto",
                  stacked: false,
                  reverse: false,
                }}

                curve="monotoneX"

                colors={[
                  "#7c3aed",
                ]}

                lineWidth={3}

                enableArea={true}
                areaOpacity={0.12}

                enablePoints={true}
                pointSize={7}
                pointColor="#ffffff"
                pointBorderWidth={2.5}
                pointBorderColor="#7c3aed"

                useMesh={true}
                enableSlices="x"
                enableCrosshair={true}

                enableGridX={false}
                gridYValues={5}

                axisTop={null}
                axisRight={null}

                axisBottom={{
                  tickSize: 0,
                  tickPadding: 12,
                  tickRotation: 0,
                }}

                axisLeft={{
                  tickSize: 0,
                  tickPadding: 10,
                  tickRotation: 0,
                  format: formatCompactCurrency,
                }}

                tooltip={({ point }) => (
                  <div className="min-w-[150px] rounded-xl border border-gray-200 bg-white px-3.5 py-3 shadow-xl">

                    <div className="flex items-center gap-2">

                      <span className="w-2 h-2 rounded-full bg-purple-500" />

                      <span className="text-xs font-medium text-gray-500">
                        {point.data.x}
                      </span>

                    </div>

                    <p className="text-base font-semibold text-gray-900 mt-1.5">
                      {formatCurrency(point.data.y)}
                    </p>

                  </div>
                )}

                theme={chartTheme}
                animate={true}
                motionConfig="gentle"
              />

            ) : (

              <EmptyChart
                message="No sales data available"
              />

            )}

          </div>

        </div>

        {/* =================================================
            2. REVENUE VS COST + STOCK
        ================================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* =================================================
              REVENUE VS COST
          ================================================= */}

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

            <ChartHeader
              title="Revenue vs Cost"
              description="Sales revenue compared with product cost"
              color="bg-blue-500"
            />

            <div className="h-[320px] p-3 sm:p-5">

              {revenueCostData?.length > 0 ? (

                <ResponsiveBar
                  data={revenueCostData}

                  keys={[
                    "revenue",
                    "cost",
                  ]}

                  indexBy="date"

                  groupMode="grouped"

                  margin={{
                    top: 35,
                    right: 25,
                    bottom: 60,
                    left: 78,
                  }}

                  padding={0.3}
                  innerPadding={4}

                  borderRadius={6}

                  colors={[
                    "#3b82f6",
                    "#f59e0b",
                  ]}

                  borderWidth={0}

                  enableLabel={true}

                  labelSkipWidth={35}
                  labelSkipHeight={18}

                  label={({ id, value }) =>
                    `${id === "revenue" ? "Revenue" : "Cost"}: ${formatCompactCurrency(value)}`
                  }

                  labelTextColor="#ffffff"

                  enableGridX={false}
                  enableGridY={true}

                  axisTop={null}
                  axisRight={null}

                  axisBottom={{
                    tickSize: 0,
                    tickPadding: 12,
                    tickRotation: 0,

                    legend: "Date",
                    legendPosition: "middle",
                    legendOffset: 45,
                  }}

                  axisLeft={{
                    tickSize: 0,
                    tickPadding: 10,
                    tickRotation: 0,

                    format: formatCompactCurrency,

                    legend: "Amount (PKR)",
                    legendPosition: "middle",
                    legendOffset: -60,
                  }}

                  legends={[
                    {
                      dataFrom: "keys",

                      anchor: "top-right",

                      direction: "row",

                      justify: false,

                      translateY: -28,

                      itemWidth: 85,
                      itemHeight: 20,

                      itemsSpacing: 10,

                      symbolSize: 10,
                      symbolShape: "circle",

                      itemTextColor: "#6b7280",
                    },
                  ]}

                  tooltip={({
                    id,
                    value,
                    indexValue,
                  }) => (

                    <div className="rounded-xl border border-gray-200 bg-white px-3.5 py-3 shadow-xl">

                      <p className="text-xs text-gray-400">
                        Date: {indexValue}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5">

                        <span
                          className={`w-2 h-2 rounded-full ${
                            id === "revenue"
                              ? "bg-blue-500"
                              : "bg-amber-500"
                          }`}
                        />

                        <span className="text-xs font-medium text-gray-600">
                          {id === "revenue"
                            ? "Revenue"
                            : "Cost"}
                        </span>

                      </div>

                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {formatCurrency(value)}
                      </p>

                    </div>

                  )}

                  theme={chartTheme}

                  animate={true}

                  motionConfig="gentle"
                />

              ) : (

                <EmptyChart
                  message="Revenue and cost data not available yet"
                />

              )}

            </div>

          </div>

          {/* =================================================
              STOCK DISTRIBUTION
          ================================================= */}

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

            <ChartHeader
              title="Stock Distribution"
              description="Current inventory health"
              color="bg-green-500"
            />

            <div className="relative h-[320px]">

              {stockDistributionData.length > 0 ? (

                <>

                  <ResponsivePie
                    data={stockDistributionData}

                    margin={{
                      top: 15,
                      right: 20,
                      bottom: 45,
                      left: 20,
                    }}

                    innerRadius={0.68}

                    padAngle={2.5}

                    cornerRadius={7}

                    activeOuterRadiusOffset={8}

                    activeInnerRadiusOffset={3}

                    borderWidth={0}

                    colors={[
                      "#22c55e",
                      "#eab308",
                      "#ef4444",
                    ]}

                    enableArcLabels={true}

                    arcLabelsSkipAngle={10}

                    arcLabelsTextColor="#ffffff"

                    enableArcLinkLabels={false}

                    tooltip={({ datum }) => (
                      <div className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 shadow-xl">

                        <p className="text-xs text-gray-400">
                          {datum.label}
                        </p>

                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {datum.value} products
                        </p>

                      </div>
                    )}

                    legends={[
                      {
                        anchor: "bottom",

                        direction: "row",

                        justify: false,

                        translateY: 30,

                        itemsSpacing: 10,

                        itemWidth: 100,
                        itemHeight: 22,

                        itemTextColor: "#6b7280",

                        symbolSize: 10,
                        symbolShape: "circle",
                      },
                    ]}

                    theme={chartTheme}

                    animate={true}

                    motionConfig="gentle"
                  />

                  {/* CENTER */}

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">

                    <div className="text-center">

                      <p className="text-3xl font-bold tracking-tight text-gray-900">
                        {stockTotal}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Active Products
                      </p>

                    </div>

                  </div>

                </>

              ) : (

                <EmptyChart
                  message="No stock data available"
                />

              )}

            </div>

          </div>

        </div>

        {/* =================================================
            3. TOP PRODUCTS + PAYMENT
        ================================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* =================================================
              TOP SELLING PRODUCTS
          ================================================= */}

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

            <ChartHeader
              title="Top Selling Products"
              description="Best performing products by units sold"
              color="bg-purple-500"
            />

            <div className="h-[320px] p-3 sm:p-5">

              {topSellingProductsData?.length > 0 ? (

                <ResponsiveBar
                  data={topSellingProductsData}

                  keys={["quantity"]}

                  indexBy="product"

                  layout="horizontal"

                  margin={{
                    top: 15,
                    right: 30,
                    bottom: 35,
                    left: 110,
                  }}

                  padding={0.35}

                  borderRadius={6}

                  colors={[
                    "#8b5cf6",
                  ]}

                  borderWidth={0}

                  enableLabel={true}

                  labelSkipWidth={35}

                  labelTextColor="#ffffff"

                  enableGridX={true}
                  enableGridY={false}

                  axisTop={null}
                  axisRight={null}

                  axisBottom={{
                    tickSize: 0,
                    tickPadding: 9,

                    legend: "Units Sold",
                    legendPosition: "middle",
                    legendOffset: 30,
                  }}

                  axisLeft={{
                    tickSize: 0,
                    tickPadding: 10,
                  }}

                  tooltip={({
                    indexValue,
                    value,
                  }) => (

                    <div className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 shadow-xl">

                      <p className="text-xs text-gray-400">
                        Product
                      </p>

                      <p className="text-sm font-medium text-gray-800 mt-0.5">
                        {indexValue}
                      </p>

                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {value} units sold
                      </p>

                    </div>

                  )}

                  theme={chartTheme}

                  animate={true}

                  motionConfig="gentle"
                />

              ) : (

                <EmptyChart
                  message="Top selling data not available yet"
                />

              )}

            </div>

          </div>

          {/* =================================================
              PAYMENT METHODS
          ================================================= */}

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

            <ChartHeader
              title="Payment Methods"
              description="Revenue distribution by payment method"
              color="bg-blue-500"
              rightContent={
                <div className="text-right shrink-0">

                  <p className="text-xs text-gray-400">
                    Total
                  </p>

                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                    {formatCurrency(paymentTotal)}
                  </p>

                </div>
              }
            />

            <div className="h-[280px] p-3 sm:p-5">

              {paymentMethodData.length > 0 ? (

                <ResponsiveBar
                  data={paymentMethodData}

                  keys={["amount"]}

                  indexBy="method"

                  layout="horizontal"

                  margin={{
                    top: 30,
                    right: 35,
                    bottom: 60,
                    left: 82,
                  }}

                  padding={0.38}

                  borderRadius={8}

                  colors={({ indexValue }) => {

                    const method =
                      String(indexValue).toLowerCase();

                    if (method === "cash") {
                      return "#22c55e";
                    }

                    if (method === "card") {
                      return "#3b82f6";
                    }

                    return "#8b5cf6";
                  }}

                  borderWidth={0}

                  enableLabel={true}

                  labelSkipWidth={20}

                  label={({ value }) =>
                    formatCompactCurrency(value)
                  }

                  labelTextColor="#ffffff"

                  enableGridY={false}
                  enableGridX={true}

                  axisTop={null}
                  axisRight={null}

                  axisBottom={{
                    tickSize: 0,
                    tickPadding: 12,
                    tickRotation: 0,

                    format: formatCompactCurrency,

                    legend: "Amount (PKR)",
                    legendPosition: "middle",
                    legendOffset: 45,
                  }}

                  axisLeft={{
                    tickSize: 0,
                    tickPadding: 12,
                    tickRotation: 0,

                    legend: "Payment Method",
                    legendPosition: "middle",
                    legendOffset: -65,
                  }}

                  tooltip={({
                    indexValue,
                    value,
                  }) => (

                    <div className="rounded-xl border border-gray-200 bg-white px-3.5 py-3 shadow-xl">

                      <p className="text-xs text-gray-400">
                        Payment Method
                      </p>

                      <p className="text-sm font-semibold text-gray-800 capitalize mt-1">
                        {indexValue}
                      </p>

                      <div className="mt-1.5">

                        <span className="text-xs text-gray-500">
                          Revenue
                        </span>

                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(value)}
                        </p>

                      </div>

                    </div>

                  )}

                  theme={chartTheme}

                  animate={true}

                  motionConfig="gentle"
                />

              ) : (

                <EmptyChart
                  message="No payment data available"
                />

              )}

            </div>

          </div>

        </div>

      </div>
    );
  }
);

DashboardCharts.displayName = "DashboardCharts";

export default DashboardCharts;