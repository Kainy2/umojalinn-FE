import { UmojaLinnChat } from '@/types/project';
import { useEffect, useState } from 'react'
import { app } from "@/lib/firebase";

import { sendChatInProject } from "@/actions/project";
// import { base62ToUuidSafe } from "@/lib/uuid";
import { getDatabase, ref, onValue, off } from "firebase/database";
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

	// useEffect(() => {

	// 	const database = getDatabase(app);

	// 	// Reference to the specific collection in the database
	// 	const collectionRef = ref(
	// 		database,
	// 		`chats/${base62ToUuidSafe(projectId)}/messages`,
	// 	);

	// 	// Function to fetch data from the database
	// 	const handleSnapshot = () => {
	// 		// Listen for changes in the collection
	// 		onValue(collectionRef, (snapshot) => {
	// 			const dataItem = snapshot.val();

	// 			console.log(dataItem, "<<< DATA FROM CHAT");

	// 			// Check if dataItem exists
	// 			if (dataItem) {
	// 				// Convert the object values into an array
	// 				const displayItem = Object.values(
	// 					dataItem,
	// 				) as unknown as UmojaLinnChat[];
	// 				console.log("HISTORY >>>", displayItem);
	// 				setData(displayItem);
	// 			}
	// 		});
	// 	};

	// 	// Fetch data when the component mounts
	// 	handleSnapshot();

	// 	return () => off(collectionRef);
	// }, [projectId]);

useEffect(() => {
	if (!projectId) return;

	const db = getDatabase(app);
	const messagesRef = ref(db, `chats/${projectId}/messages`);

	const unsubscribe = onValue(messagesRef, (snapshot) => {
		const dataItem = snapshot.val();
		if (dataItem) {
			const displayItem = Object.values(dataItem) as UmojaLinnChat[];
			setData(displayItem);
		} else {
			setData([]); // Clear if no data
		}
	});


	return () => {
		unsubscribe();
		off(messagesRef); // ✅ Detach listener on unmount
	};
}, [projectId]);


	const handleSend = async () => {
		try {
			setLoading(true);
			await sendChatInProject(projectId, jsonToFormData({ message, images }));
			// setMessage("");
			// setImages([]);
			// setPreviewUrls([]);
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