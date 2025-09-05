import { useEffect, useState } from 'react'
import { database } from "@/lib/firebase";

import { UmojaLinnNotification } from '@/types/user';
import { ref, onValue } from "firebase/database";
import useHandleError from './useHandleError';
import { useSession } from 'next-auth/react';

export const useGetFirebaseNotifications = () => {
	const [data, setData] = useState<UmojaLinnNotification[]>([]);
	const {data: session} = useSession();
	const userId = session?.user?.id ?? ''

	const { handleError } = useHandleError("Send Chat");
	
	useEffect(() => {
		if (!userId) return;

		// Reference to the specific collection in the database
		const collectionRef = ref(database, `notifications/${userId}`);

		// Listen for changes in the collection
		const unSubscribe = onValue(collectionRef, (snapshot) => {
			const dataItem: Record<string, UmojaLinnNotification> | null = snapshot.val() ;

			if (dataItem) {
				const displayItem = Object.values(dataItem);
				setData(displayItem);
			}
		});

		return () => {
			unSubscribe();
		};
	}, [userId]);

	const handleRead = async () => {
		try {
			// setLoading(true);
			// await sendChatInProject();
		} catch (error) {
			handleError(error);
		} finally {
			// setLoading(false);
		}
	};

	return {
		data,
		handleRead,
	}
}
