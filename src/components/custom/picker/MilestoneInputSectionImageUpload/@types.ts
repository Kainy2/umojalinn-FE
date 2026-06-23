export interface IMilestoneInputSectionImageUploadProps {
  files?: FileList | null;
  onFilesChange?: (files: FileList | null) => void;
  disabled?: boolean;
}
