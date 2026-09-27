import { useEffect, useState } from 'react'
import { database } from "@/lib/firebase";

import { UmojaLinnNotification } from '@/types/user';
import { ref, onValue, orderByChild, query, limitToLast } from "firebase/database";
import useHandleError from './useHandleError';
import { useSession } from 'next-auth/react';

export const useGetFirebaseNotifications = () => {
	const [data, setData] = useState<UmojaLinnNotification[]>([]);
	const {data: session} = useSession();
	const userId = session?.user?.id ?? ''

	const { handleError } = useHandleError("Send Chat");
	
	useEffect(() => {
		if (!userId) return;

		// Query reference to the specific collection in the database to perform query filters
		const collectionQuery = query(
			ref(database, `notifications/${userId}`),
			orderByChild("createdAt"),
			limitToLast(50)
		);

		// Listen for changes in the collection
		const unSubscribe = onValue(collectionQuery, (snapshot) => {
			const notifications: UmojaLinnNotification[] = [];

			snapshot.forEach((child) => {
				 notifications.push({
    id: child.key,
    ...child.val(),
  });
			});

			setData(notifications.toReversed()); // DESC
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
