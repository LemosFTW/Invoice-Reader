"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tesseract from "tesseract.js";
import SideBar from "@/components/sideBar";
import createAxiosInstance from "@/../lib/axiosInstance";
import { SignOut } from "@/components/signOut";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const { data: session, status } = useSession();
  const API = createAxiosInstance(session?.accessToken as string);

  const readImageContent = async (image: File) => {
    const url = URL.createObjectURL(image);
    const data = await Tesseract.recognize(url, "por");
    const contentParse = data.lines.map((line: any) => line.text).join("\n");
    setContent(contentParse);
    setEditedContent(contentParse);
    URL.revokeObjectURL(url);
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
    if (!file || !session) return;

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("userEmail", session.user.email as string);

      const uploadResponse = await API.post("/upload", data, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 0));
          setUploadProgress(progress);
        }
      });
      if (uploadResponse.status === 201) {
        await readImageContent(file);
        toast.success("File uploaded successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload file");
    } finally {
      setUploadProgress(0); // Reset progress after upload
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
    if (!file || !session) return;

    setIsEditing(false);

    const updateData = {
      fileName: file.name,
      userEmail: session.user.email as string,
      content: editedContent,
    };

    try {
      const updateResponse = await API.patch("/upload", updateData);
      if (updateResponse.status === 200) {
        toast.success("File updated successfully");
        setContent(editedContent);
        router.push("/dashboard/invoices");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update file");
    }
  };

  return (
    <>
      <div className="flex h-screen">
        <SideBar show={showSidebar} setter={setShowSidebar} />
        <div className="flex-1 flex flex-col min-h-screen bg-gray-900">
          <div className="flex justify-end p-4">
            <SignOut />
          </div>
          <div className="flex-grow grid place-items-center">
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
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="border-2 border-gray-300 border-dashed rounded-md p-4 w-full text-white bg-gray-700"
                  draggable="true"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = e.dataTransfer.files;
                    if (files && files.length > 0) {
                      setFile(files[0]);
                    }
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
              {uploadProgress > 0 && (
                <div className="w-full bg-gray-700 rounded-lg mb-4">
                  <div
                    className="bg-blue-500 text-xs leading-none py-1 text-center text-white rounded-lg"
                    style={{ width: `${uploadProgress}%` }}
                  >
                    {uploadProgress}%
                  </div>
                </div>
              )}
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
                      type="button"
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                      onClick={handleEditSubmit}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                      onClick={() => setIsEditing(true)}
                    >
                      Approve/Edit
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
