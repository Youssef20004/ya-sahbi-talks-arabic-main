import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProfilePictureUploadProps {
  setProfilePicture: (file: File | null) => void;
  setError: (error: string) => void;
  error: string;
  disabled?: boolean;
  studentId?: string;
  existingPhotoUrl?: string | null;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  setProfilePicture,
  setError,
  error,
  disabled = false,
  studentId,
  existingPhotoUrl,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>(existingPhotoUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

  const handleProfileImageClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // Reset input and states
    if (!file) {
      event.target.value = '';
      setProfilePicture(null);
      setPreviewUrl(existingPhotoUrl || '');
      setError('');
      return;
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      event.target.value = '';
      setProfilePicture(null);
      setPreviewUrl(existingPhotoUrl || '');
      setError('يجب أن تكون الصورة بصيغة JPG أو PNG.');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      event.target.value = '';
      setProfilePicture(null);
      setPreviewUrl(existingPhotoUrl || '');
      setError('حجم الصورة يجب ألا يتجاوز 2 ميغابايت.');
      return;
    }

    // Create preview for the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    setProfilePicture(file);
    setError(''); // Clear any previous errors
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative cursor-pointer ${disabled ? 'opacity-80 cursor-not-allowed' : 'hover:opacity-90'}`}
        onClick={handleProfileImageClick}
      >
        <Avatar className="w-32 h-32 border-4 border-gray-200">
          <AvatarImage src={previewUrl} alt="صورة الملف الشخصي" />
          <AvatarFallback className="bg-gray-100 text-gray-400 text-lg">
            {previewUrl ? 'صورة' : 'اختر صورة'}
          </AvatarFallback>
        </Avatar>

        {!disabled && (
          <div className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full w-8 h-8 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </div>
        )}

        {disabled && previewUrl && (
          <svg
            className="absolute top-0 right-0 w-6 h-6 text-gray-600 bg-white rounded-full p-1 border border-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2c0 .757.414 1.414 1.022 1.757L8 15h4l-1.022-2.243C11.586 12.414 12 11.757 12 11zm-2-7C5.589 4 2 7.589 2 12s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8z"
            />
          </svg>
        )}
      </div>

      <input
        ref={fileInputRef}
        id="id_profile_picture"
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />

      {disabled && previewUrl && (
        <div className="mt-2 text-center text-sm text-gray-600">
          الصورة مقفلة بعد الحفظ
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mt-2 max-w-xs">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mt-2 text-sm text-gray-500 text-center">
        اختر صورة شخصية (JPG أو PNG)<br />
        الحجم الأقصى: 2 ميغابايت
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
