// components/UserTable.tsx
"use client";

import * as React from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import UserFormDialog from "./UserFormDialog"; 
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";



type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: { name: string };
};

export default function UserTable() {
  const [open, setOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const queryClient = useQueryClient();



  
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get<User[]>(
        "https://jsonplaceholder.typicode.com/users"
      );
      return res.data;
    },
    refetchOnWindowFocus: false, 
    staleTime: Infinity,
  });

  const [search, setSearch] = React.useState("");
  const [sortAsc, setSortAsc] = React.useState(true);
  const [companyFilter, setCompanyFilter] = React.useState<string>("");


  const companyList = React.useMemo(() => {
    return Array.from(new Set(users.map((u) => u.company.name)));
  }, [users]);

  
  const filtered = React.useMemo(() => {
    let list = [...users];

    if (search.trim()) {
      list = list.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (companyFilter) {
      list = list.filter((u) => u.company.name === companyFilter);
    }

    list.sort((a, b) => {
      return sortAsc
        ? a.email.localeCompare(b.email)
        : b.email.localeCompare(a.email);
    });

    return list;
  }, [users, search, sortAsc, companyFilter]);

  return (
    <div className="p-6 space-y-4">
      {}
      <div className="flex gap-4 items-center">
        {}
        <input
          type="text"
          placeholder="Search by name..."
          className="border px-3 py-2 rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
<button
  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
  onClick={() => {
    setEditingUser(null); 
    setOpen(true);       
  }}
>
  Add User
</button>

        {}
        <button
          onClick={() => setSortAsc((prev) => !prev)}
          className="border px-3 py-2 rounded-md"
        >
          Sort Email {sortAsc ? "(A–Z)" : "(Z–A)"}
        </button>

        {}
        <Select.Root
          value={companyFilter}
          onValueChange={(val) => setCompanyFilter(val)}
        >
          <Select.Trigger className="border px-3 py-2 rounded-md inline-flex items-center justify-between w-[200px]">
            <Select.Value placeholder="Filter by company" />
            <Select.Icon>
              <ChevronDown size={16} />
            </Select.Icon>
          </Select.Trigger>
          <Select.Content className="bg-white border rounded-md shadow">
            <Select.ScrollUpButton className="flex items-center justify-center p-2">
              <ChevronUp size={16} />
            </Select.ScrollUpButton>
            <Select.Viewport>
              {}
              <Select.Item value="__all__">
                <Select.ItemText>All Companies</Select.ItemText>
                <Select.ItemIndicator>
                  <Check size={14} />
                </Select.ItemIndicator>
              </Select.Item>

              {companyList.map((company) => (
                <Select.Item key={company} value={company}>
                  <Select.ItemText>{company}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check size={14} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Root>
      </div>

      {}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border p-2">Avatar</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Company</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="border p-2 text-center">
                {u.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </td>
              <td className="border p-2">{u.name}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.phone}</td>
              <td className="border p-2">{u.company.name}</td>
              <td className="border p-2">
                <button
  className="text-blue-600 hover:underline mr-2"
  onClick={() => {
    setEditingUser(u);
    setOpen(true);
  }}
>
  Edit
</button>
                <button className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}

          {filtered.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center p-4 text-gray-500">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
<UserFormDialog open={open} onOpenChange={setOpen} initialData={editingUser} />
    </div>
  );
}
