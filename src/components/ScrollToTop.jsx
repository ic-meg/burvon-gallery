import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
	const { pathname, search, hash } = useLocation();

	useEffect(() => {
		// Scroll window to top
		window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
		
		// Also try to scroll the main element if it exists
		const mainElement = document.querySelector('main');
		if (mainElement && typeof mainElement.scrollTo === 'function') {
			mainElement.scrollTo({ top: 0, left: 0, behavior: 'auto' });
		}

		// Try to scroll the document body as well
		if (document.body && typeof document.body.scrollTo === 'function') {
			document.body.scrollTo({ top: 0, left: 0, behavior: 'auto' });
		}

		// Try to scroll the document element
		if (document.documentElement && typeof document.documentElement.scrollTo === 'function') {
			document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'auto' });
		}
	}, [pathname, search, hash]);

	return null;
};

export default ScrollToTop; 