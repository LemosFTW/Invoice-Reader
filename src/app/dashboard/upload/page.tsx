"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tesseract from "tesseract.js";
import SideBar from "@/components/sideBar";
import createAxiosInstance from "@/../lib/axiosInstance";

export default function Upload() {
  const [file, setFile] = useState<File>();
  const [showSidebar, setShowSidebar] = useState(false);
  
  const { data: session, status } = useSession();
  
    var API = createAxiosInstance(session?.accessToken as string);
 





  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const readImageContent = async (image: any) => {
    let data = await Tesseract.recognize(image, "por");
    const contentParse = data.lines.map((line: any) => line.text).join("\n");
    setContent(contentParse);
    setEditedContent(contentParse);
  };
  
  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [editedContent]);

  if (status === "loading") return <p>Loading...</p>;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    try {
      const data = new FormData();
      data.set("file", file);
      data.set("userEmail", session?.user?.email as string);

      await API
        .post("/upload", data)
        .then((res) => {
          let url = URL.createObjectURL(file);
          if (res.status === 201) readImageContent(url);
        })
        .catch((e) => {
          console.error(e);
        });

      const updateData = {
        fileName: file.name,
        userEmail: session?.user?.email as string,
        content: editedContent,
      };

      await API
        .patch("/upload", updateData)
        .then((res) => {
          if (res.status === 200) toast.success("File uploaded successfully");
        })
        .catch((e) => {
          console.error(e);
        });
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleEditSubmit = async () => {
    setIsEditing(false);

    const updateData = {
      fileName: file?.name as string,
      userEmail: session?.user?.email as string,
      content: editedContent,
    };

    try {
      const res = await API.patch("/upload", updateData);
      if (res.status === 200) toast.success("File updated successfully");
    } catch (e) {
      console.error(e);
    }

    setContent(editedContent);
    setIsEditing(false);
    router.push("/dashboard/invoices");

  };

  return (
    <>
      <div className="flex h-screen ">
        <SideBar show={showSidebar} setter={setShowSidebar} />

        <div className="min-h-screen grid place-items-center bg-gray-900">
          <form
            onSubmit={onSubmit}
            className="w-full max-w-xl bg-gray-800 p-8 rounded-lg shadow-md"
          >
            <h1 className="text-4xl font-bold mb-8 text-center text-white">
              Upload a new Invoice
            </h1>
            <div className="mb-6">
              <input
                type="file"
                name="file"
                onChange={(e) => setFile(e.target.files?.[0])}
                className="border-2 border-gray-300 border-dashed rounded-md p-4 w-full text-white bg-gray-700"
                draggable="true"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                }}
              />
            </div>
            <div className="flex justify-center mb-6">
              <input
                type="submit"
                value="Upload"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              />
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h2 className="text-xl font-bold text-white mt-4">Content</h2>

              {isEditing ? (
                <textarea
                  ref={textareaRef}
                  value={editedContent}
                  onChange={handleEditChange}
                  className="w-full p-3 mt-2 text-gray-200 bg-gray-800 rounded-lg resize-none focus:outline-none"
                  rows={10}
                  style={{ overflow: "hidden", backgroundColor: "inherit" }}
                ></textarea>
              ) : (
                <p className="text-sm text-gray-200 mt-2 whitespace-pre-wrap">
                  {content}
                </p>
              )}

              <div className="flex justify-end mt-4">
                {isEditing ? (
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                    onClick={() => {
                      handleEditSubmit();
                    }}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
