import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
	const { pathname, search, hash } = useLocation();

	useEffect(() => {
		
		const mainElement = document.querySelector('main');
		if (mainElement && typeof mainElement.scrollTo === 'function') {
			mainElement.scrollTo({ top: 0, left: 0, behavior: 'auto' });
		}

		// to make the page always scrollto top as default
		window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
	}, [pathname, search, hash]);

	return null;
};

export default ScrollToTop; 