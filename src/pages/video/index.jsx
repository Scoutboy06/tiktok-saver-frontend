import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import styles from './video.module.css';

export default function Video() {
	const params = useParams();
	const [videoMeta, setVideoMeta] = useState(null);
	const [rotation, setRotation] = useState(0);

	useEffect(() => {
		(async () => {
			setVideoMeta(null);
			console.log(params.id);
			const raw = await fetch('/api/videos/' + params.id);
			const videoMeta = await raw.json();

			const json = JSON.parse(localStorage.getItem('videosInCategory')) || {};
			const savedVideos = json[videoMeta.category.name];
			if (savedVideos) {
				const index = savedVideos.indexOf(videoMeta._id);
				if (index > -1) {
					if (index !== 0) videoMeta.prevVid = savedVideos[index - 1];
					if (index !== savedVideos.length - 1)
						videoMeta.nextVid = savedVideos[index + 1];
				} else {
					// TODO: get videos if not saved
				}
			}

			setVideoMeta(videoMeta);
		})();
	}, [params.id]);

	return (
		<div className={styles.container}>
			<Link
				className={styles.button}
				style={{ position: 'fixed', top: 10, left: 10 }}
				to={
					videoMeta?.category?.name
						? '/category/' + videoMeta?.category?.name
						: '/'
				}
			>
				<img src='/icons/close_white.svg' alt='Close video' />
			</Link>

			{videoMeta ? (
				<>
					{videoMeta?.prevVid && (
						<Link
							to={'/video/' + videoMeta.prevVid}
							className={styles.button}
							style={{ marginRight: 10 }}
						>
							<img
								src='/icons/navigate_before_white.svg'
								alt='Previous video'
							/>
						</Link>
					)}

					<video
						src={videoMeta.video.playAddr}
						style={{
							transform: `rotate(${rotation}deg)`,
							maxHeight: rotation % 2 === 0 ? '100vh' : '100vw',
							maxWidth: rotation % 2 === 0 ? '100vw' : '100vh',
						}}
						controls
						autoPlay
						loop
					></video>

					{videoMeta?.nextVid && (
						<Link
							to={videoMeta?.nextVid ? '/video/' + videoMeta?.nextVid : '#'}
							className={styles.button}
							style={{ marginLeft: 10 }}
						>
							<img src='/icons/navigate_next_white.svg' alt='Next video' />
						</Link>
					)}
				</>
			) : (
				<h1>Loading...</h1>
			)}

			<div className={styles.buttonContainer}>
				<button
					className={styles.button}
					onClick={() => {
						setRotation(v => (v - 90) % 360);
					}}
				>
					<img src='/icons/screen_rotation_white.svg' alt='Rotate screen' />
				</button>

				<button
					className={styles.button}
					onClick={() => {
						window.open(videoMeta.url, '_blank');
					}}
				>
					<img src='/icons/open_in_new_white.svg' alt='Open original video' />
				</button>

				<button
					className={styles.button}
					onClick={() => {
						if (window.confirm('Are you sure you want to delete this video?')) {
							fetch('/api/videos/' + params.id, { method: 'DELETE' })
								.then(res => {
									if (!res.ok) {
										console.error(res);
										alert('An error occured when trying to delete the video');
									} else {
										console.log(res);
										alert('Deleted video successfully');
									}
								})
								.catch(err => {
									console.error(err);
									alert(err.message);
								});
						}
					}}
				>
					<img src='/icons/delete_white.svg' alt='Delete video' />
				</button>
			</div>

			<div className={styles.statsContainer}>
				<img src='/icons/heart_white.svg' alt='Likes:' />
				&nbsp;
				{videoMeta ? numberWithPrefix(videoMeta.stats.diggCount) : '-'}
				&nbsp;&nbsp;&nbsp;
				<img src='/icons/chat_white.svg' alt='Comments:' />
				&nbsp;
				{videoMeta ? numberWithPrefix(videoMeta.stats.commentCount) : '-'}
				&nbsp;&nbsp;&nbsp;
				<img src='/icons/share_white.svg' alt='Shares:' />
				&nbsp;
				{videoMeta ? numberWithPrefix(videoMeta.stats.shareCount) : '-'}
			</div>
		</div>
	);
}

function numberWithPrefix(n) {
	if (typeof n !== 'number' && !isNaN(n)) return '-';

	n = n.toString();

	/* 
	Examples:
	1500 -> 1500

	10000 -> 10 K
	10500 -> 10,5 K

	100000 -> 100 K
	100500 -> 100,5 K

	1500000 -> 1,5 M
	1000000 -> 1 M

	10000000 -> 10 M
	10500000 -> 10,5 M

	etc.
	*/

	if (n < 10_000) return n;
	else if (n < 100_000)
		return n.substring(0, 2) + (n[2] !== '0' ? `,${n[2]}` : '') + ' K';
	else if (n < 1_000_000)
		return n.substring(0, 3) + (n[3] !== '0' ? `,${n[3]}` : '') + ' K';
	else if (n < 10_000_000)
		return n.substring(0, 1) + (n[1] !== '0' ? `,${n[1]}` : '') + ' M';
	else if (n < 100_000_000)
		return n.substring(0, 2) + (n[2] !== '0' ? `,${n[2]}` : '') + ' M';
	else if (n < 1_000_000_000)
		return n.substring(0, 3) + (n[3] !== '0' ? `,${n[3]}` : '') + ' M';
	else return '>= 1 000 000 000';
}
