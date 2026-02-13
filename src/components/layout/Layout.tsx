import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col min-w-0">
      <Header />
      <main className="flex-1 min-w-0 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
