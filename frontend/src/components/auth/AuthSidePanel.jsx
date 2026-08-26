import React from "react";

const AuthSidePanel = () => {
  return (
    <div className="relative hidden overflow-hidden bg-[#6D28D9] text-white lg:flex lg:w-1/2">

      {/* Decorative shapes */}
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10" />

      <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-white/10" />

      <div className="relative z-10 flex w-full flex-col justify-center px-16 xl:px-24">

        {/* Brand */}
        <div className="mb-10 flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/15">
            <span className="text-2xl">
              📦
            </span>
          </div>

          <div>
            <p className="text-lg font-bold">
              InventoryPro
            </p>

            <p className="text-xs text-purple-200">
              Smarter Stock Management
            </p>
          </div>

        </div>

        {/* Main Content */}
        <div className="max-w-lg">

          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-purple-200">
            Everything in one place
          </p>

          <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
            Stay in control of
            <span className="block text-purple-200">
              your stock & sales.
            </span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-7 text-purple-100">
            Organize products, monitor stock, manage
            sales and keep an eye on your business
            performance with ease.
          </p>

          {/* Features */}
          <div className="mt-10 grid max-w-md grid-cols-2 gap-3">

            {/* Stock */}
            <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">

              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                📦
              </div>

              <p className="text-sm font-semibold">
                Stock Control
              </p>

              <p className="mt-1 text-xs text-purple-200">
                Know what's available
              </p>

            </div>

            {/* Sales */}
            <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">

              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                🛒
              </div>

              <p className="text-sm font-semibold">
                Sales Tracking
              </p>

              <p className="mt-1 text-xs text-purple-200">
                Keep sales organized
              </p>

            </div>

            {/* Alerts */}
            <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">

              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                ⚠️
              </div>

              <p className="text-sm font-semibold">
                Stock Alerts
              </p>

              <p className="mt-1 text-xs text-purple-200">
                Never miss low stock
              </p>

            </div>

            {/* Insights */}
            <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">

              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                📈
              </div>

              <p className="text-sm font-semibold">
                Business Insights
              </p>

              <p className="mt-1 text-xs text-purple-200">
                See how your business performs
              </p>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSidePanel;