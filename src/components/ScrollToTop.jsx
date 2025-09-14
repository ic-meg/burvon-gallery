import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop } from '../helpers/ScrollHelper';

const ScrollToTop = () => {
	const { pathname, search, hash } = useLocation();

	useEffect(() => {
		// Use the optimized scroll helper with a smallllll delay
		// to ensure DOM is ready and any animations/transitions are complete :)0
		scrollToTop({ smooth: false, delay: 100 });
	}, [pathname, search, hash]);

	return null;
};

export default ScrollToTop; 