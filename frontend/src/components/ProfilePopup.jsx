import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { VscClose, VscSave } from "react-icons/vsc";
import { authClient } from "@/lib/auth-client";

const ProfilePopup = ({ user, onClose }) => {
  const [name, setName] = useState(user?.name || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setIsSaving(true);

      const { error } = await authClient.updateUser({
        name: name.trim(),
      });

      if (error) {
        toast.error(error.message || "Failed to update profile");
        return;
      }

      toast.success("Profile updated successfully!");
      onClose();
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const userInitial =
    user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              My Profile
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update your profile information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
          >
            <VscClose size={21} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Profile Preview */}
          <div className="flex flex-col items-center">
             
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-900 text-2xl font-semibold text-white">
                {userInitial}
              </div>
            
          </div>

       

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#6D28D9] focus:ring-2 focus:ring-[#6D28D9]/20"
            />
          </div>

          {/* Email - Read Only */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="mt-2 w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Role - Read Only */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>

            <input
              type="text"
              value={user?.role || ""}
              disabled
              className="mt-2 w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm capitalize text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg bg-[#6D28D9] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#5B21B6] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              <VscSave size={17} />

              {isSaving ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default ProfilePopup;