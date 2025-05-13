import { UmojaLinnChat } from '@/types/project';
import { useEffect, useState } from 'react'
import { database } from "@/lib/firebase";

import { sendChatInProject } from "@/actions/project";
import { ref, onValue } from "firebase/database";
import { jsonToFormData } from '@/lib/utils';
import useHandleError from './useHandleError';

const useChat = (projectId: string
) => {
	const [data, setData] = useState<UmojaLinnChat[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<string>("");
	const [previewUrls, setPreviewUrls] = useState<string[]>([]);
	const [images, setImages] = useState<File[]>([]);

	const { handleError } = useHandleError("Send Chat");

	useEffect(() => {
		// Reference to the specific collection in the database
		const collectionRef = ref(database, `chats/${projectId}/messages`);

		// Listen for changes in the collection
		const unSubscribe = onValue(collectionRef, (snapshot) => {
			const dataItem = snapshot.val() as Record<string, UmojaLinnChat> | null;

			if (dataItem) {
				const displayItem = Object.values(dataItem);
				console.log("HISTORY >>>", displayItem);
				setData(displayItem);
			}
		});

		return () => {
			unSubscribe();
		};
	}, [projectId]);

	const handleSend = async () => {
		try {
			setLoading(true);
			await sendChatInProject(projectId, jsonToFormData({ message, images }));
			setMessage("");
			setImages([]);
			setPreviewUrls([]);
		} catch (error) {
			handleError(error);
		} finally {
			setLoading(false);
		}
	};

	return {
		data,
		handleSend,
		loading,
		message,
		setMessage,
		previewUrls,
		setPreviewUrls,
		images,
		setImages,
	}
}

export default useChat