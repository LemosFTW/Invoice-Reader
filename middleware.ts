import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/', // Página de login
  },
});

export const config = {
  matcher: ['/dashboard/:path*'], // Rotas protegidas
};