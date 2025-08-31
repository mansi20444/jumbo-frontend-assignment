"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type UserFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any; 
};
type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: { name: string };
};


export default function UserFormDialog({ open, onOpenChange, initialData }: UserFormDialogProps) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone,
        company: initialData.company?.name || "",
      });
    } else {
      setForm({ name: "", email: "", phone: "", company: "" });
    }
  }, [initialData]);

  
const mutation = useMutation({
  mutationFn: async (newUser: typeof form) => {
    return axios.post("https://jsonplaceholder.typicode.com/users", {
      ...newUser,
      company: { name: newUser.company },
    });
  },
  onMutate: async (newUser) => {
    await queryClient.cancelQueries({ queryKey: ["users"] });
    const previousUsers = queryClient.getQueryData<User[]>(["users"]) || [];

    
    queryClient.setQueryData<User[]>(["users"], [
      ...previousUsers,
      { ...newUser, id: Date.now(), company: { name: newUser.company } },
    ]);

    return { previousUsers };
  },
  onError: (_err, _newUser, context) => {
    if (context?.previousUsers) {
      queryClient.setQueryData(["users"], context.previousUsers);
    }
  },
  
});


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-w-md w-full -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
          <Dialog.Title className="text-xl font-semibold mb-4">
            {initialData ? "Edit User" : "Add User"}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              className="w-full border p-2 rounded"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />

            <div className="flex justify-end gap-2">
              <Dialog.Close asChild>
                <button type="button" className="px-4 py-2 rounded bg-gray-200">
                  Cancel
                </button>
              </Dialog.Close>
              <button
  type="submit"
  className="px-4 py-2 rounded bg-blue-600 text-white"
  disabled={mutation.isPending}
>
  {mutation.isPending
    ? "Loading..."
    : initialData
    ? "Save"
    : "Add"}
</button>

                
              
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
