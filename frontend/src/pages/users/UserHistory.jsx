import { useParams, useNavigate } from "react-router-dom";
import { useGetUserAuditLogsQuery } from "../../services/auditLogApi";

const UserHistory = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetUserAuditLogsQuery(userId);

  const logs = data || [];

  const loginCount = logs.filter(
    (log) => log.action === "LOGIN"
  ).length;

  const logoutCount = logs.filter(
    (log) => log.action === "LOGOUT"
  ).length;

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading user history...</p>
      </div>
    );
  }

  if (isError) {
    console.error("User history error:", error);

    return (
      <div className="p-6">
        <p className="text-red-500">
          Unable to load user history.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold">
            User History
          </h1>

          <p className="text-sm text-gray-500">
            View user activity and login history
          </p>
        </div>

        <button
          onClick={() => navigate("/users")}
          className="border px-4 py-2 rounded-md"
        >
          Back to Users
        </button>

      </div>


      {/* ================= SUMMARY ================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">
            Total Activities
          </p>

          <p className="text-2xl font-bold">
            {logs.length}
          </p>
        </div>


        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">
            Login Count
          </p>

          <p className="text-2xl font-bold">
            {loginCount}
          </p>
        </div>


        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">
            Logout Count
          </p>

          <p className="text-2xl font-bold">
            {logoutCount}
          </p>
        </div>

      </div>


      {/* ================= HISTORY ================= */}

      <div className="border rounded-lg">

        <div className="p-4 border-b">
          <h2 className="font-semibold">
            Activity History
          </h2>
        </div>


        {logs.length === 0 ? (

          <div className="p-8 text-center text-gray-500">
            No activity history found.
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="border-b text-left">

                  <th className="p-4">
                    Date & Time
                  </th>

                  <th className="p-4">
                    Action
                  </th>

                  <th className="p-4">
                    Module
                  </th>

                  <th className="p-4">
                    Description
                  </th>

                </tr>
              </thead>


              <tbody>

                {logs.map((log) => (

                  <tr
                    key={log.id}
                    className="border-b"
                  >

                    <td className="p-4">
                      {new Date(
                        log.createdAt
                      ).toLocaleString()}
                    </td>


                    <td className="p-4">
                      {log.action}
                    </td>


                    <td className="p-4">
                      {log.module}
                    </td>


                    <td className="p-4">
                      {log.description}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};

export default UserHistory;