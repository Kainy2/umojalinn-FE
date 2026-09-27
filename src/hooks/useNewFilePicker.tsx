import { MAX_FILE_SIZE_FOR_FILE_UPLOAD_BYTES } from '@/constant';
import React, { useState } from 'react'
import useFilePicker, { FilePickerOptions, useFileSizeError } from './useFilePicker';
import { mergeFiles } from '@/lib/utils';

type useNewFilePickerOptions = {
	onSelect?: (combinedFiles: FileList | null) => void;
} & Omit<FilePickerOptions, 'onSelect'>;

const useNewFilePicker = ({
	onSelect,
	accept = 'image/*,video/*',
	multiple = true,
	...props
 }: useNewFilePickerOptions = {}) => {
	const [images, setImages] = React.useState<FileList | null>(null);
	const [previewMedia, setPreviewMedia] = useState<{type: string, url: string}[]>([]);
	const { isFileSizeValid } = useFileSizeError(MAX_FILE_SIZE_FOR_FILE_UPLOAD_BYTES);

	const { Input, onClick } = useFilePicker({
		onSelect: (files) => {
			if (!files) return;
			if (!isFileSizeValid(files)) return;
			const combinedFiles = mergeFiles(images, files);

			setImages(combinedFiles);
			setPreviewMedia(
				Array.from(combinedFiles).map((file) => ({
					type: file.type,
					url: URL.createObjectURL(file),
				}))
			);
			onSelect?.(combinedFiles);
		},
		accept,
		multiple,
		...props
	});

	return ({
		Input,
		onClick,
		images,
		setImages,
		previewMedia,
		setPreviewMedia,
		isFileSizeValid
	})
}

export default useNewFilePicker