import {
  Package,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Boxes,
} from "lucide-react";

const ProductStats = ({ stats }) => {
  const statCards = [
    {
      title: "Total Products",
      value: stats.total,
      label: "All products",
      icon: Package,
      wrapper: "bg-blue-50 border-blue-100",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      valueColor: "text-blue-700",
    },
    {
      title: "In Stock",
      value: stats.inStock,
      label: "Healthy stock",
      icon: CheckCircle2,
      wrapper: "bg-green-50 border-green-100",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      valueColor: "text-green-700",
    },
    {
      title: "Low Stock",
      value: stats.lowStock,
      label: "Needs reorder",
      icon: AlertTriangle,
      wrapper: "bg-orange-50 border-orange-100",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      valueColor: "text-orange-700",
    },
    {
      title: "Out of Stock",
      value: stats.outOfStock,
      label: "Needs attention",
      icon: XCircle,
      wrapper: "bg-red-50 border-red-100",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      valueColor: "text-red-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {statCards.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className={`border rounded-2xl p-5 ${stat.wrapper} hover:-translate-y-0.5 hover:shadow-md transition-all duration-200`}
          >
            <div className="flex items-start justify-between">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.iconBg}`}
              >
                <Icon size={21} className={stat.iconColor} />
              </div>

              <Boxes size={18} className="text-gray-300" />
            </div>

            <p className="text-sm text-gray-600 mt-5">
              {stat.title}
            </p>

            <div className="flex items-end justify-between mt-1">
              <p className={`text-2xl font-bold ${stat.valueColor}`}>
                {stat.value}
              </p>

              <span className="text-xs text-gray-500 mb-1">
                {stat.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductStats;