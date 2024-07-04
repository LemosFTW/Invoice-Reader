"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Import from next/navigation
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [invoices, setInvoices] = useState([
    { id: 0, filename: "", extractedText: "" },
  ]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && !session) router.push("/");
  }, [session, status, router]);

  if (status === "loading") return <p>Loading...</p>;

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    let userEmail = "";

    if (session?.user !== (null || undefined))
      userEmail = session.user.email as string;

    await axios
      .post("http://localhost:8000/invoices", { email: userEmail })
      .then((response) => {
        if (response.status === 201) {
          console.log("Invoices fetched successfully");
          setInvoices(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching invoices:", error);
      });
  };

  const deleteInvoice = async (id: number) => {
    let userEmail = session?.user?.email as string;
    console.log(id)
    await axios
      .delete(`http://localhost:8000/invoices/${id}`, {
        data: { email: userEmail },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("Invoice deleted successfully");
          fetchInvoices();
        }
      })
      .catch((error) => {
        console.error("Error deleting invoice:", error);
      });
  };

  const editInvoice = async (e: React.MouseEvent<HTMLButtonElement>) => {};

  return(
    <div className="container mx-auto p-4">
      
      <h1 className="text-2xl font-bold mb-4">Invoices Dashboard</h1>
      {/* print invoices: invoices.filename , invoices.extractedText, invoices.id */}
      {Array.isArray(invoices) && invoices.length > 0 ? (
        invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="flex flex-row justify-between items-center p-4 mb-4 border border-gray-300 rounded-lg shadow-sm bg-white"
          >
            <div className="flex flex-row items-center">
              <div className="ml-4">
                <span className="text-lg font-semibold text-gray-700">
                  ID: {invoice.id}
                </span>
                <p className="text-lg font-semibold text-gray-900">
                  {invoice.filename}
                </p>
                <p className="text-sm text-gray-600">{invoice.extractedText}</p>
              </div>
            </div>
            <div className="flex flex-row space-x-2">
              <button
                className="text-white bg-blue-500 border border-blue-500 p-2 rounded-md hover:bg-blue-600"
                onClick={(e) => editInvoice(e)}
              >
                Edit
              </button>
              <button
                className="text-white bg-red-500 border border-red-500 p-2 rounded-md hover:bg-red-600"
                onClick={() => deleteInvoice(invoice.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No invoices found.</p>
      )}
    </div>
  );
}