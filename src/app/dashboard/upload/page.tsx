"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tesseract from "tesseract.js";
import {OpenAI,AzureOpenAI,ClientOptions} from "openai";

export default function Upload() {
  const [file, setFile] = useState<File>();
  const { data: session, status } = useSession();
  const [showSidebar, setShowSidebar] = useState(false);
  const [lines, setLines] = useState([]); // [ {text: "line1"}, {text: "line2"}]
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const router = useRouter();

  const readImageContent = async (image: any) => {
    let data = await Tesseract.recognize(image, 'por');
    setLines(data.lines as any);
    // setContent(data.text);
    var contentParse  = data.lines.map((line: any) => line.text).join('\n');
    // console.log(contentParse)
    setContent(contentParse);

    // summarizeContent(data.text);
  }

  //Summarize the content using OpenAI
  const summarizeContent = async (text: string) => {
    try {
        const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY , dangerouslyAllowBrowser: true});
  
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "Você é um assistente que ajuda a resumir textos." },
            { role: "user", content: `Faça um resumo detalhado do seguinte texto em português e divida em tópicos principais: ${text}` }
          ],
          max_tokens: 150,
        });

      if (response.choices && response.choices.length > 0) 
        response.choices[0].message.content != null ? setSummary(response.choices[0].message.content) : setSummary('No summary found');
      
    } catch (error) {
      console.error("Error summarizing content:", error);
    }
  };

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") return <p>Loading...</p>;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    try {
      const data = new FormData();
      data.set("file", file);
      data.set("userEmail", session?.user?.email as string);

      await axios
        .post("http://localhost:8000/upload", data)
        .then((res) => {
          let url = URL.createObjectURL(file);
          if (res.status === 201)
            readImageContent(url);
        })
        .catch((e) => {
          console.error(e);
        });


        var updateData = {
          fileName: file.name,
          userEmail: session?.user?.email as string,
          //content: summary
          content: content
        }
        await axios.patch('http://localhost:8000/upload', updateData )
        .then((res) => {
          if (res.status === 200)
            toast.success("File updated successfully");

        })
        .catch((e) => {
          console.error(e);
        });




    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div>
        <h1 className=" text-4xl font-bold p-5 mx-12 text-center">
          Upload a new Invoice
        </h1>
      </div>

      <form
        onSubmit={onSubmit}
        className="h-screen flex items-center justify-center "
      >
        <input
          type="file"
          name="file"
          onChange={(e) => setFile(e.target.files?.[0])}
          className=" border-2 border-gray-300 border-dashed rounded-md p-4 w-96 "
          draggable="true"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
          }}
        />

        <input
          type="submit"
          value="Upload"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-12 py-2 px-4 rounded"
        />
      </form>
      <div>
        <div className="flex gap-x-[30px] mt-20">
          <div>
            <h2>Summary</h2>
            {summary && <p>{summary}</p>}
            {content && <p>{content}</p>}
          </div>
          {/* <h2>Content</h2>
            {lines.map((line, index) => (
              <p key={index}>{line}</p>
            ))} */}
        </div>
      </div>
    </>
  );
}
