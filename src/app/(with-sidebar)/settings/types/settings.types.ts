export interface AvatarUploadState {
  file: File | null;
  preview: string | null;
  isUploading: boolean;
}

export interface SettingsTabProps {
  /** Whether the form has unsaved changes */
  isDirty: boolean;
  /** Whether the form is currently saving */
  isSaving: boolean;
  /** Callback to handle save */
  onSave: () => void;
  /** Callback to handle cancel */
  onCancel: () => void;
}

export type SettingsTab = 'account' | 'profile';
