import React from "react";
import AdminHeader from "./header";
import AdminFooter from "./footer";

interface User {
  id: number;
  username: string;
  email: string;
  isActive: boolean; // Condition to decide button text
}

interface UserTableProps {
  users: User[];
}

const UserManagement: React.FC<UserTableProps> = ({ users }) => {
  return (
    <div className="overflow-x-auto mt-6">
        <AdminHeader />
      <table className="w-full border-collapse">
        {/* Table Head */}
        <thead className="bg-[#D6D1F0] text-black">
          <tr>
            <th className="py-2 px-4 text-left">Username</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Action</th>
          </tr>
        </thead>
        
        {/* Table Body */}
        <tbody>
          {users.map((user, index) => (
            <tr
              key={user.id}
              className={`${
                index % 2 === 0 ? "bg-[#F4F1FD]" : "bg-[#E9E6F6]"
              } text-black`}
            >
              <td className="py-2 px-4">{user.username}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded transition"
                >
                  {user.isActive ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AdminFooter />
    </div>
  );
};

export default UserManagement;
