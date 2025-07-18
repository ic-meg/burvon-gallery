import Header from "../components/header";
import Footer from "../components/Footer";
import Chat from "../components/FloatingChat";

const Template = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Chat />

      <main className="flex-grow pt-24 px-6 py-12 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to Burvon Jewelry Gallery
        </h1>
      </main>

      <Footer />
    </div>
  );
};

export default Template;
