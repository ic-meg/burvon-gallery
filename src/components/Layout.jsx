import Header from "./header";
import Footer from "./Footer";
import Chat from "./FloatingChat";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Chat />
      
      <main className="flex-grow pt-24 px-6 py-12 overflow-y-auto">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout; 