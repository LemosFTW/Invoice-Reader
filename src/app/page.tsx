import Image from "next/image";
import { GetServerSideProps } from 'next';


type User = {
  id: number;
  name: string;
  email: string;
};

type Props = {
  users: User[];
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    </main>
  );
}
