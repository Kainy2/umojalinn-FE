import { UmojaLinnChat } from '@/types/project';
import { useEffect, useState } from 'react'
import { database } from "@/lib/firebase";

import { sendChatInProject } from "@/actions/project";
import { ref, onValue } from "firebase/database";
import { jsonToFormData } from '@/lib/utils';
import useHandleError from './useHandleError';
import {  base62ToUuidSafe } from '@/lib/uuid';

import { useSession } from 'next-auth/react';

 export const useChat = (
	projectId: string
) => {
	const { data: session } = useSession();
	const [data, setData] = useState<UmojaLinnChat[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<string>("");
	const [previewMedia, setPreviewMedia] = useState<{type: string, url: string}[]>([]);
	const [images, setImages] = useState<File[]>([]);

	const [activeCallParticipants, setActiveCallParticipants] = useState<number>(0);
	const [isUserInCall, setIsUserInCall] = useState<boolean>(false);

	const { handleError } = useHandleError("Send Chat");

	useEffect(() => {
		// Reference to the specific collection in the database
		const chatPath = base62ToUuidSafe(projectId);
		const collectionRef = ref(database, `chats/${chatPath}/messages`);
		const callParticipantsRef = ref(database, `chats/${chatPath}/active_call/participants`);

		// Listen for messages
		const unSubscribeMessages = onValue(collectionRef, (snapshot) => {
			const dataItem: Record<string, UmojaLinnChat> | null = snapshot.val();

			if (dataItem) {
				const displayItem = Object.values(dataItem);
				setData(displayItem);
			}
		});

		// Listen for active call participants
		const unSubscribeCall = onValue(callParticipantsRef, (snapshot) => {
			const participants = snapshot.val();
			if (participants) {
				const participantIds = Object.keys(participants);
				setActiveCallParticipants(participantIds.length);
				setIsUserInCall(participantIds.includes(session?.user?.id as string));
			} else {
				setActiveCallParticipants(0);
				setIsUserInCall(false);
			}
		});

		return () => {
			unSubscribeMessages();
			unSubscribeCall();
		};
	}, [projectId]);

	const handleSend = async () => {
		try {
			setLoading(true);
			await sendChatInProject(projectId, jsonToFormData({ message, images }));
			setMessage("");
			setImages([]);
			setPreviewMedia([]);
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
		previewMedia,
		setPreviewMedia,
		images,
		setImages,
		isCallActive: activeCallParticipants > 0,
		isUserInCall,
	}
}

