import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-rose-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      <footer className="text-center py-6 text-gray-400 text-sm border-t border-rose-100 mt-8">
        © 2026 Bisutería Shop — Todos los derechos reservados
      </footer>
    </div>
  );
}
