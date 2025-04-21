
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FormSubmissionStatusProps {
  formSubmitted: boolean;
}

const FormSubmissionStatus: React.FC<FormSubmissionStatusProps> = ({ formSubmitted }) => {
  if (!formSubmitted) return null;
  
  return (
    <Alert className="mt-4 bg-green-50 border-green-200">
      <AlertDescription>
        تم حفظ البيانات بنجاح. لا يمكن تعديلها الآن.
      </AlertDescription>
    </Alert>
  );
};

export default FormSubmissionStatus;
