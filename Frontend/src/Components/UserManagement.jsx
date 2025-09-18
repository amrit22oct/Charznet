import React from "react";

const UserManagement = ({ users, view, changeRole, removeUser }) =>
  view === "grid" ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {users.map((u) => (
        <div key={u._id} className="bg-white p-6 rounded-xl shadow">
          <h3>{u.name}</h3>
          <p>{u.email}</p>
          <p className="text-sm">Role: {u.role}</p>
          <button onClick={() => changeRole(u._id, u.role === "user" ? "author" : "user")} className="text-blue-500 mr-3">
            Change Role
          </button>
          <button onClick={() => removeUser(u._id)} className="text-red-500">
            Remove
          </button>
        </div>
      ))}
    </div>
  ) : (
    <table className="w-full bg-white shadow-md rounded-lg">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-3">Name</th>
          <th className="p-3">Email</th>
          <th className="p-3">Role</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u._id} className="border-t">
            <td className="p-3">{u.name}</td>
            <td className="p-3">{u.email}</td>
            <td className="p-3">{u.role}</td>
            <td className="p-3">
              <button onClick={() => changeRole(u._id, u.role === "user" ? "author" : "user")} className="text-blue-500 mr-3">
                Change Role
              </button>
              <button onClick={() => removeUser(u._id)} className="text-red-500">
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

export default UserManagement;
