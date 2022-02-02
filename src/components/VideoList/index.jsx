import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import VideoPreviewCard from '../VideoPreviewCard';

const fetchVideos = categoryName =>
	fetch(`/api/categories/${categoryName}`)
		.then(res => res.json())
		.catch(console.error);

export default function VideoList() {
	const params = useParams();
	const results = {};
	const [videos, setVideos] = useState([]);

	useEffect(() => {
		if (results[params.name]) setVideos(results[params.name]);
		else {
			(async () => {
				const v = await fetchVideos(params.name);
				if (v) {
					setVideos(v);
					const json =
						JSON.parse(localStorage.getItem('videosInCategory')) || {};
					json[params.name] = v.map(vid => vid._id);
					localStorage.setItem('videosInCategory', JSON.stringify(json));
				} else {
					console.error('Failed to load videos or no videos saved');
				}
			})();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.name]);

	return (
		<>
			{videos.map &&
				videos.map(video => <VideoPreviewCard key={video._id} video={video} />)}
		</>
	);
}
