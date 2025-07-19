import Header from "../components/header";
import Footer from "../components/Footer";
import Chat from "../components/FloatingChat";

const Template = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Chat />

      <main className="flex-grow pt-24 px-6 py-12 overflow-y-auto">

        {/* CONTENT START HERE, DELETE NIYO NALANG YUNG MGA NASA BABA  */}
        <h1 className="text-3xl font-bold mb-8 text-center">
          Welcome to Burvon Jewelry Gallery
        </h1>
        
        {/* Hero Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Discover Our Collection</h2>
            <p className="text-gray-700 mb-6">
              Explore our exquisite collection of handcrafted jewelry pieces, each telling a unique story of elegance and craftsmanship.
            </p>
            <button className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors">
              Shop Now
            </button>
          </div>
        </section>

        {/* Featured Products */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-center">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-500">Product Image {item}</span>
                </div>
                <h3 className="font-semibold mb-2">Elegant Necklace {item}</h3>
                <p className="text-gray-600 mb-4">Beautiful handcrafted necklace with premium materials.</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-amber-600">$299</span>
                  <button className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section className="mb-16">
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6 text-center">About Burvon</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Our Story</h3>
                <p className="text-gray-700 mb-4">
                  Founded with a passion for creating timeless pieces, Burvon has been crafting exceptional jewelry for over two decades. Our commitment to quality and design excellence has made us a trusted name in the industry.
                </p>
                <p className="text-gray-700">
                  Every piece in our collection is carefully designed and crafted by skilled artisans who share our vision of creating jewelry that celebrates life's special moments.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Our Promise</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Premium quality materials</li>
                  <li>• Handcrafted excellence</li>
                  <li>• Lifetime warranty</li>
                  <li>• Ethical sourcing</li>
                  <li>• Personalized service</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-center">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((item) => (
              <div key={item} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-semibold">Customer {item}</h4>
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">
                  "Absolutely stunning pieces! The quality and craftsmanship are exceptional. I've received so many compliments on my Burvon jewelry."
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="mb-16">
          <div className="bg-amber-600 text-white p-8 rounded-lg text-center">
            <h2 className="text-2xl font-semibold mb-4">Stay Updated</h2>
            <p className="mb-6">Be the first to hear about new designs and exclusive offers!</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-amber-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-center">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-amber-600 text-2xl">📧</span>
              </div>
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-600">info@burvon.com</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-amber-600 text-2xl">📞</span>
              </div>
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-amber-600 text-2xl">📍</span>
              </div>
              <h3 className="font-semibold mb-2">Visit Us</h3>
              <p className="text-gray-600">123 Jewelry St, City</p>
            </div>
          </div>
        </section>

        {/* Extra content to ensure scrolling */}
        <section className="mb-16">
          <div className="bg-gray-100 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6 text-center">Scroll Down to Test Footer Interaction</h2>
            <p className="text-center text-gray-600 mb-8">
              Keep scrolling to see how the floating chat button changes when it reaches the footer!
            </p>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-2">Scroll Section {item}</h3>
                  <p className="text-gray-600">
                    This is additional content to ensure you can scroll down and test the floating chat button's behavior when it intersects with the footer.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Template;
