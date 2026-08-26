import { useState } from "react";
import {
  LogOut,
  UserMinus,
  X,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

import { useRemoveParticipantMutation } from "../../services/chatApi";

const GroupMembersPanel = ({
  conversation,
  user,
  members,
  onClose,
  onLeaveConversation,
}) => {
  const [removeParticipant, { isLoading: isRemoving }] =
    useRemoveParticipantMutation();

  const [confirmAction, setConfirmAction] = useState(null);

  const isGroupCreator =
    conversation?.createdBy === user?.id;

  /*
  |-----------------------------------------
  | Remove Member
  |-----------------------------------------
  */

  const handleRemoveMember = (memberId, memberName) => {
    if (!isGroupCreator) return;

    setConfirmAction({
      type: "remove",
      userId: memberId,
      userName: memberName,
    });
  };

  /*
  |-----------------------------------------
  | Leave Group
  |-----------------------------------------
  */

  const handleLeaveGroup = () => {
    if (isGroupCreator) return;

    setConfirmAction({
      type: "leave",
    });
  };

  /*
  |-----------------------------------------
  | Confirm Action
  |-----------------------------------------
  */

  const handleConfirm = async () => {
    if (!confirmAction) return;

    try {
      /*
      | REMOVE MEMBER
      */

      if (confirmAction.type === "remove") {
        await removeParticipant({
          conversationId: conversation.id,
          userId: confirmAction.userId,
        }).unwrap();

        toast.success(
          `${confirmAction.userName} removed from the group`
        );
      }

      /*
      | LEAVE GROUP
      */

      if (confirmAction.type === "leave") {
        await removeParticipant({
          conversationId: conversation.id,
          userId: user.id,
        }).unwrap();

        toast.success("You left the group");

        setConfirmAction(null);
        onClose?.();
        onLeaveConversation?.();

        return;
      }

      setConfirmAction(null);
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <>
      {/* =========================================
          MEMBERS PANEL
      ========================================= */}

      <div className="absolute right-5 top-[72px] z-30 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Group Members
            </h3>

            <p className="text-xs text-gray-500">
              {members.length} members
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={17} />
          </button>
        </div>

        {/* Members */}

        <div className="max-h-72 overflow-y-auto">
          {members.map((member) => {
            const memberId =
              member?.id ||
              member?.userId ||
              member?.user?.id;

            const memberName =
              member?.name ||
              member?.user?.name ||
              "User";

            const memberRole =
              member?.role ||
              member?.user?.role ||
              "";

            const isCreator =
              memberId === conversation.createdBy;

            const isCurrentUser =
              memberId === user?.id;

            return (
              <div
                key={memberId}
                className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0"
              >
                {/* Avatar */}

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-700">
                  {memberName
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                {/* Info */}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {memberName}
                    </p>

                    {isCurrentUser && (
                      <span className="text-[10px] text-gray-400">
                        You
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {memberRole && (
                      <p className="truncate text-xs capitalize text-gray-500">
                        {memberRole}
                      </p>
                    )}

                    {isCreator && (
                      <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-600">
                        Creator
                      </span>
                    )}
                  </div>
                </div>

                {/* Remove button */}

                {isGroupCreator && !isCreator && (
                  <button
                    type="button"
                    disabled={isRemoving}
                    onClick={() =>
                      handleRemoveMember(
                        memberId,
                        memberName
                      )
                    }
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    title="Remove member"
                  >
                    <UserMinus size={17} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Leave Group */}

        {!isGroupCreator && (
          <div className="border-t border-gray-200 p-3">
            <button
              type="button"
              onClick={handleLeaveGroup}
              disabled={isRemoving}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut size={17} />

              Leave Group
            </button>
          </div>
        )}
      </div>

      {/* =========================================
          CONFIRMATION MODAL
      ========================================= */}

      {confirmAction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Icon */}

            <div className="flex justify-center pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle size={24} />
              </div>
            </div>

            {/* Content */}

            <div className="px-6 pb-5 pt-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {confirmAction.type === "leave"
                  ? "Leave Group?"
                  : "Remove Member?"}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {confirmAction.type === "leave"
                  ? `Are you sure you want to leave "${conversation.name}"?`
                  : `Are you sure you want to remove ${confirmAction.userName} from this group?`}
              </p>
            </div>

            {/* Buttons */}

            <div className="flex gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4">
              <button
                type="button"
                disabled={isRemoving}
                onClick={() =>
                  setConfirmAction(null)
                }
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isRemoving}
                onClick={handleConfirm}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isRemoving
                  ? "Please wait..."
                  : confirmAction.type === "leave"
                  ? "Leave Group"
                  : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupMembersPanel;