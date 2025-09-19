import React from "react";

const UserManagement = ({ users = [], view, changeRole, removeUser }) => {
  if (!users.length) {
    return <p className="text-gray-500 mt-4">No users found.</p>;
  }

  // Table view
  if (view === "table") {
    const headerHeight = 48; // adjust if needed
    const sideBarWidth = 256; // example sidebar width

    return (
      <div className="relative w-full h-full">
        {/* Fixed table header */}
        <table
          className="fixed top-[135px] left-[16rem] w-[calc(100%-16rem)] border-collapse table-fixed bg-gray-200 z-30"
        >
          <thead>
            <tr>
              <th className="p-3 text-left font-semibold cursor-default w-1/3">Name</th>
              <th className="p-3 text-left font-semibold cursor-default w-1/3">Email</th>
              <th className="p-3 text-left font-semibold cursor-default w-1/3">Role</th>
              <th className="p-3 text-left font-semibold cursor-default w-1/3">Actions</th>
            </tr>
          </thead>
        </table>

        {/* Scrollable table body */}
        <div
          className="overflow-auto scrollbar-hide"
          style={{ maxHeight: `calc(100vh - 88px - 16px)`, marginTop: `${headerHeight}px` }}
        >
          <table className="w-full border-collapse table-fixed text-sm">
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-t hover:bg-gray-50 transition cursor-default"
                >
                  <td className="p-3 w-1/4">{u.name}</td>
                  <td className="p-3 w-1/4">{u.email}</td>
                  <td className="p-3 w-1/4">{u.role}</td>
                  <td className="p-3 w-3/4 flex gap-3 justify-center">
                    <button
                      onClick={() => changeRole(u._id, u.role === "user" ? "author" : "user")}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition cursor-pointer font-medium"
                    >
                      Change Role
                    </button>
                    <button
                      onClick={() => removeUser(u._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition cursor-pointer font-medium"
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
  }

  // Grid view
  return (
   <div className="grid grid-cols-3 gap-3 m-4 overflow-auto scrollbar-hide">
  {users.map((u) => (
    <div
      key={u._id}
      className="bg-white p-3 h-[150px] rounded-xl shadow hover:shadow-lg transition flex flex-col cursor-default"
    >
      <div>
        <h3 className="text-lg font-semibold mb-0.5">{u.name}</h3>
        <p className="text-gray-600 text-sm mb-0.5">{u.email}</p>
        <p className="text-gray-500 text-sm">Role: {u.role}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => changeRole(u._id, u.role === "user" ? "author" : "user")}
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition cursor-pointer font-medium text-sm"
        >
          Change Role
        </button>
        <button
          onClick={() => removeUser(u._id)}
          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition cursor-pointer font-medium text-sm"
        >
          Remove
        </button>
      </div>
    </div>
  ))}
</div>

  
  );
};

export default UserManagement;
