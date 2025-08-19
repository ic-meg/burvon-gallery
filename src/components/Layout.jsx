import Header from "./header";
import Footer from "./Footer";
import Chat from "./FloatingChat";

const Layout = ({ children, full = false, contentClassName }) => {
	const computedMainClassName = contentClassName
		? contentClassName
		: full
			? "flex-grow"
			: "flex-grow pt-24 px-6 py-12";

	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<Chat />
			
			<main className={computedMainClassName}>
				{children}
			</main>
			
			<Footer />
		</div>
	);
};

export default Layout; 