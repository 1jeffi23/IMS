import { useState } from "react";
import {
  X,
  Receipt,
  DollarSign,
  CalendarDays,
  Tag,
  FileText,
} from "lucide-react";

import { useCreateExpenseMutation } from "../../services/expenseApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ExpenseForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    amount: "",
    expenseDate: new Date().toISOString().split("T")[0],
    description: "",
  });

  const [createExpense, { isLoading }] =
    useCreateExpenseMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createExpense({
        ...formData,
        amount: Number(formData.amount),
      }).unwrap();

      onClose();
    } catch (error) {
      console.error("Failed to create expense:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-background shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background p-5">

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-100 p-2.5 text-red-600 dark:bg-red-950">
              <Receipt className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Add Expense
              </h2>

              <p className="text-sm text-muted-foreground">
                Record a new business expense
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5"
        >

          {/* Title + Category */}
          <div className="grid gap-5 md:grid-cols-2">

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Receipt className="h-4 w-4 text-muted-foreground" />
                Expense Title
              </label>

              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Electricity Bill"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Tag className="h-4 w-4 text-muted-foreground" />
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">
                  Select category
                </option>

                <option value="Rent">
                  Rent
                </option>

                <option value="Utilities">
                  Utilities
                </option>

                <option value="Salary">
                  Salary
                </option>

                <option value="Transport">
                  Transport
                </option>

                <option value="Maintenance">
                  Maintenance
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>
          </div>

          {/* Amount + Date */}
          <div className="grid gap-5 md:grid-cols-2">

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                Amount
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  Rs.
                </span>

                <Input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                Expense Date
              </label>

              <Input
                type="date"
                name="expenseDate"
                value={formData.expenseDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Description
            </label>

            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add any additional details about this expense..."
              rows={4}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="gap-2"
            >
              <Receipt className="h-4 w-4" />

              {isLoading
                ? "Saving..."
                : "Save Expense"}
            </Button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;