import { UmojaLinnChat } from '@/types/project';
import { useEffect, useState } from 'react'
import { firebaseConfig } from "@/lib/firebase";

import { sendChatInProject } from "@/actions/project";
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { base62ToUuidSafe } from "@/lib/uuid";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { jsonToFormData } from '@/lib/utils';
import useHandleError from './useHandleError';

let app: FirebaseApp
if (!getApps?.()?.length) {
	app = initializeApp?.(firebaseConfig);
}



const useChat = (projectId: string
) => {
	const [data, setData] = useState<UmojaLinnChat[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<string>("");
	const [previewUrls, setPreviewUrls] = useState<string[]>([]);
	const [images, setImages] = useState<File[]>([]);

	const { handleError } = useHandleError("Send Chat");
	useEffect(() => {

		const database = getDatabase(app);

		// Reference to the specific collection in the database
		const collectionRef = ref(
			database,
			`chats/${base62ToUuidSafe(projectId)}/messages`,
		);

		// Function to fetch data from the database
		const fetchData = () => {
			// Listen for changes in the collection
			onValue(collectionRef, (snapshot) => {
				const dataItem = snapshot.val();

				console.log(dataItem, "<<< DATA FROM CHAT");

				// Check if dataItem exists
				if (dataItem) {
					// Convert the object values into an array
					const displayItem = Object.values(
						dataItem,
					) as unknown as UmojaLinnChat[];
					console.log("HISTORY >>>", displayItem);
					setData(displayItem);
				}
			});
		};

		// Fetch data when the component mounts
		fetchData();

		return () => off(collectionRef);
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