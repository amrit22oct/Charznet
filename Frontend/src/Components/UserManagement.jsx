import React from "react";

const UserManagement = ({ users, view, changeRole, removeUser }) => {
  if (!users || users.length === 0) {
    return <p className="text-gray-500">No users found.</p>;
  }

  return view === "grid" ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full overflow-auto scrollbar-hide">
      {users.map((u) => (
        <div
          key={u._id}
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-default"
        >
          <h3 className="text-lg font-semibold">{u.name}</h3>
          <p className="text-gray-600">{u.email}</p>
          <p className="text-sm text-gray-500 mb-4">Role: {u.role}</p>
          <div className="flex gap-3">
            <button
              onClick={() =>
                changeRole(u._id, u.role === "user" ? "author" : "user")
              }
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition cursor-pointer"
            >
              Change Role
            </button>
            <button
              onClick={() => removeUser(u._id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    // Table View
    <div className="bg-white shadow rounded-lg flex flex-col h-full w-full">
    <div className="flex-1 overflow-auto scrollbar-hide">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-200 sticky top-0 z-10">
          <tr>
            <th className="p-3 text-left font-semibold cursor-default">Name</th>
            <th className="p-3 text-left font-semibold cursor-default">Email</th>
            <th className="p-3 text-left font-semibold cursor-default">Role</th>
            <th className="p-3 text-left font-semibold cursor-default">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u._id}
              className="border-t hover:bg-gray-50 transition cursor-default"
            >
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.role}</td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() =>
                    changeRole(u._id, u.role === "user" ? "author" : "user")
                  }
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition cursor-pointer"
                >
                  Change Role
                </button>
                <button
                  onClick={() => removeUser(u._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  
  );
};

export default UserManagement;
