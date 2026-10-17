import { useLayoutEffect, useState } from "react";

// 新图片加载并解码完成前保留旧图片，否则 background-image 切换期间会露出空白
export const useDecodedImageUrl = (url: string): string => {
	const [loadedUrl, setLoadedUrl] = useState(url);

	useLayoutEffect(() => {
		if (!url) {
			setLoadedUrl("");
			return;
		}
		let active = true;
		const image = new Image();
		image.decoding = "async";
		image.onload = async () => {
			try {
				await image.decode();
			} catch {}
			if (active) setLoadedUrl(image.naturalWidth > 0 ? url : "");
		};
		image.onerror = () => {
			if (active) setLoadedUrl("");
		};
		image.src = url;
		return () => {
			active = false;
			image.onload = null;
			image.onerror = null;
		};
	}, [url]);

	return loadedUrl;
};
