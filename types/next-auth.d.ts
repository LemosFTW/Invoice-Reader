import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user: {
            name: string;
            email: string;
            image: string;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
    }
}
