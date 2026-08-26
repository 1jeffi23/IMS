import { useState } from "react";
import { Search, Users, X } from "lucide-react";

const CreateGroupModal = ({
  users,
  currentUserId,
  onClose,
  onCreate,
  isCreating,
}) => {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");

  const availableUsers = users.filter(
    (item) =>
      item.id !== currentUserId &&
      (item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.email?.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) return;

    if (selectedUsers.length === 0) return;

    await onCreate({
      name: groupName.trim(),
      participantIds: selectedUsers,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Create Group
            </h2>

            <p className="text-sm text-gray-500">
              Create a conversation with your team
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

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Group Name
              </label>

              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g. Store Team"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Select Members
                </label>

                <span className="text-xs text-gray-500">
                  {selectedUsers.length} selected
                </span>
              </div>

              <div className="relative mb-3">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search users..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div className="max-h-56 overflow-y-auto rounded-xl border border-gray-200">
                {availableUsers.length === 0 ? (
                  <div className="p-5 text-center text-sm text-gray-500">
                    No users found.
                  </div>
                ) : (
                  availableUsers.map((item) => {
                    const selected = selectedUsers.includes(item.id);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleUser(item.id)}
                        className={`flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition last:border-b-0 ${
                          selected
                            ? "bg-purple-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 font-semibold text-purple-700">
                          {item.name?.charAt(0).toUpperCase() || "U"}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {item.name}
                          </p>

                          <p className="truncate text-xs text-gray-500">
                            {item.email}
                          </p>
                        </div>

                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded border ${
                            selected
                              ? "border-purple-600 bg-purple-600"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {selected && (
                            <span className="text-xs font-bold text-white">
                              ✓
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {selectedUsers.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Users size={16} />
                  Selected Members
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((userId) => {
                    const selectedUser = users.find(
                      (item) => item.id === userId
                    );

                    if (!selectedUser) return null;

                    return (
                      <span
                        key={userId}
                        className="flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700"
                      >
                        {selectedUser.name}

                        <button
                          type="button"
                          onClick={() => toggleUser(userId)}
                          className="rounded-full hover:bg-purple-100"
                        >
                          <X size={13} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isCreating ||
                !groupName.trim() ||
                selectedUsers.length === 0
              }
              className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCreating ? "Creating..." : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;