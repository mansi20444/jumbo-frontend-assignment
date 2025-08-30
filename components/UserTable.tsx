"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/lib/api";
import { useUserStore } from "@/store/useUserStore";

export default function UserTable() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const { setSelectedUser } = useUserStore();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">User Management</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Avatar</th>
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Phone</th>
            <th className="text-left p-2">Company</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user: any) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="p-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  {user.name.charAt(0)}
                </div>
              </td>
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.phone}</td>
              <td className="p-2">{user.company.name}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => setSelectedUser(user)}
                  className="px-3 py-1 text-sm bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
