import { Link } from 'react-router-dom';

import styles from './VideoPreviewCard.module.css';

export default function VideoPreviewCard({ video }) {
	return (
		<Link className={styles.card} to={'/video/' + video._id}>
			<img src={video.video.cover} alt='Not found' />
		</Link>
	);
}
