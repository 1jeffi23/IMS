import { useState } from "react";
import {
  MessageCircle,
  Users,
  X,
} from "lucide-react";

import CreateGroupModal from "./CreateGroupModal";

const CreateConversationModal = ({
  users = [],
  currentUserId,
  onClose,
  onCreate,
  onCreateGroup,
  isCreating = false,
}) => {
  const [activeTab, setActiveTab] =
    useState("direct");

  // MUST be a string
  const [search, setSearch] = useState("");

  const [showGroupModal, setShowGroupModal] =
    useState(false);

  const availableUsers = users.filter(
    (item) => item.id !== currentUserId
  );

  if (showGroupModal) {
    return (
      <CreateGroupModal
        users={users}
        currentUserId={currentUserId}
        onClose={() =>
          setShowGroupModal(false)
        }
        onCreate={async (groupData) => {
          await onCreateGroup(groupData);
        }}
        isCreating={isCreating}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              New Conversation
            </h2>

            <p className="text-sm text-gray-500">
              Start a conversation with your team
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 border-b border-gray-200">

          {/* Direct */}
          <button
            type="button"
            onClick={() =>
              setActiveTab("direct")
            }
            className={`flex items-center justify-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "direct"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <MessageCircle size={17} />
            Direct Chat
          </button>

          {/* Group */}
          <button
            type="button"
            onClick={() =>
              setActiveTab("group")
            }
            className={`flex items-center justify-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "group"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Users size={17} />
            Group Chat
          </button>
        </div>

        {/* Direct Chat */}
        {activeTab === "direct" && (
          <div className="p-5">

            {/* Search */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Users */}
            <div className="max-h-72 overflow-y-auto rounded-xl border border-gray-200">

              {availableUsers
                .filter((item) => {
                  const value = String(search)
                    .trim()
                    .toLowerCase();

                  const name = String(
                    item.name ?? ""
                  ).toLowerCase();

                  const email = String(
                    item.email ?? ""
                  ).toLowerCase();

                  return (
                    name.includes(value) ||
                    email.includes(value)
                  );
                })
                .map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      onCreate(item)
                    }
                    disabled={isCreating}
                    className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-gray-50 disabled:opacity-50"
                  >

                    {/* Avatar */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 font-semibold text-purple-700">
                      {item.name
                        ?.charAt(0)
                        .toUpperCase() || "U"}
                    </div>

                    {/* User info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {item.name}
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {item.email}
                      </p>
                    </div>

                    {/* Role */}
                    <span className="text-xs text-gray-400">
                      {item.role}
                    </span>
                  </button>
                ))}

              {availableUsers.length === 0 && (
                <div className="p-5 text-center text-sm text-gray-500">
                  No users available.
                </div>
              )}

            </div>
          </div>
        )}

        {/* Group Chat */}
        {activeTab === "group" && (
          <div className="p-5">
            <div className="rounded-2xl bg-purple-50 p-5 text-center">

              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <Users size={25} />
              </div>

              <h3 className="font-semibold text-gray-900">
                Create a Group
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Add multiple team members to a shared conversation.
              </p>

              <button
                type="button"
                onClick={() =>
                  setShowGroupModal(true)
                }
                disabled={isCreating}
                className="mt-4 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Create Group
              </button>

            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-5 py-4">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-200"
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  );
};

export default CreateConversationModal;