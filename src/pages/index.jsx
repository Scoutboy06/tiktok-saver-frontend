import { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import styles from './index.module.css';

const fetchCategories = () =>
	fetch('/api/categories')
		.then(res => res.json())
		.catch(console.error);

export default function Index() {
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		(async () => {
			const cat = await fetchCategories();
			if (cat) setCategories(cat);
			else console.error('Error when fetching categories');
		})();
	}, []);

	return (
		<main className={styles.main}>
			<section className={styles.section}>
				{categories.map(category => (
					<NavLink
						to={`/category/${category.name}`}
						key={category._id}
						className={({ isActive }) =>
							styles.category + (isActive ? ' ' + styles.active : '')
						}
						exact='true'
					>
						<div
							onClick={() => {
								window.scrollTo(0, 0);
							}}
						>
							{category.name}
							<img src='/icons/navigate_next_white.svg' alt='>' />
						</div>
					</NavLink>
				))}
			</section>

			<section className={styles.section}>
				<Outlet />
			</section>
		</main>
	);
}
