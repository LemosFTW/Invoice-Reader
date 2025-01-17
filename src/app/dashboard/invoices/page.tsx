"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import SideBar from "@/components/sideBar";
import createAxiosInstance from "@/../lib/axiosInstance";
import { SignOut } from "@/components/signOut";
import { toast,ToastContainer } from "react-toastify";

//Invoice interface
interface Invoice {
  id: number;
  filename: string;
  extractedText: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  var API = createAxiosInstance(session?.accessToken as string);

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [editInvoiceSelectedData, setEditInvoiceSelectedData] =
    useState<Invoice | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (status !== "loading" && !session) router.push("/");
  }, [session, status, router]);

  useEffect(() => {
    fetchInvoices();
  }, []);


  //control the height of the textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      textareaRef.current.style.width = "auto";
      textareaRef.current.style.width = `${textareaRef.current.scrollWidth}px`;
    }
  }, [editInvoiceSelectedData?.extractedText]);


  //fetch invoices
  const fetchInvoices = async () => {
    let userEmail = session?.user?.email || "";
    try {
      const response = await API.post("/invoices", {
        email: userEmail,
      });
      if (response.status === 201) {
        setInvoices(response.data);
      }
    } catch (error) {
      toast.error("Error fetching invoices");
    }
  };


  //delete invoice
  const deleteInvoice = async (id: number) => {
    let userEmail = session?.user?.email || "";
    try {
      const response = await API.delete(`/invoices/${id}`, {
        data: { email: userEmail },
      });
      if (response.status === 200) {
        fetchInvoices();
        toast.success("Invoice deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete invoice: " + error);
    }
  };

  const editInvoice = (invoice: Invoice) => {
    setEditInvoiceSelectedData(invoice);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (editInvoiceSelectedData) {
      setEditInvoiceSelectedData({
        ...editInvoiceSelectedData,
        extractedText: e.target.value,
      });
    }
  };


  
  const handleEditSubmit = async () => {
    const userEmail = session?.user?.email || "";
    if (!editInvoiceSelectedData) return;

    const editInvoiceData: Invoice = {
      id: editInvoiceSelectedData.id,
      filename: editInvoiceSelectedData.filename,
      extractedText: editInvoiceSelectedData.extractedText,
    };

    try {
      const response = await API.put(`/invoices/${editInvoiceData.id}`, {
        content: editInvoiceData.extractedText,
        email: userEmail,
      });
      if (response.status === 200) {
        fetchInvoices();
        setEditInvoiceSelectedData(null);
        toast.success("Invoice updated successfully");
      }
    } catch (error) {
      toast.error("Error updating invoice: " + error);
    }
  };

  return (
    <>
      <div className="flex h-screen relative">
        <SideBar show={showSidebar} setter={setShowSidebar} />
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Invoices Dashboard ({invoices.length})</h1>
          {Array.isArray(invoices) && invoices.length > 0 ? (
            invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex flex-col justify-between items-start p-4 mb-4 border border-gray-300 rounded-lg shadow-sm bg-white"
              >
                <div className="flex flex-row items-center justify-between w-full">
                  <div className="flex flex-col w-full">
                    <span className="text-lg font-semibold text-gray-700">
                      ID: {invoice.id}
                    </span>
                    <p className="text-lg font-semibold text-gray-900">
                      {invoice.filename}
                    </p>
                    {editInvoiceSelectedData?.id === invoice.id ? (
                      <textarea
                        ref={textareaRef}
                        value={editInvoiceSelectedData.extractedText}
                        onChange={handleEditChange}
                        className="w-full p-3 border-none mt-2 text-black resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={5}
                        style={{ overflow: "hidden" }}
                      ></textarea>
                    ) : (
                      <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">
                        {invoice.extractedText}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-row space-x-2 ml-4">
                    {editInvoiceSelectedData?.id === invoice.id ? (
                      <button
                        className="text-white bg-blue-500 border border-blue-500 p-2 rounded-md hover:bg-blue-600"
                        onClick={handleEditSubmit}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="text-white bg-blue-500 border border-blue-500 p-2 rounded-md hover:bg-blue-600"
                        onClick={() => editInvoice(invoice)}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="text-white bg-red-500 border border-red-500 p-2 rounded-md hover:bg-red-600"
                      onClick={() => deleteInvoice(invoice.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p 
              className="text-lg font-semibold text-gray-700"
            >No invoices found.</p>
          )}
        </div>
        <div className="absolute top-4 right-4">
          <SignOut />
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
