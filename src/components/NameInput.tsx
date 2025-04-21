
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface NameInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
  disabled: boolean;
}

const NameInput: React.FC<NameInputProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  disabled
}) => {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        onChange={onChange}
        className="mt-1"
        dir="ltr"
        disabled={disabled}
      />
      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default NameInput;
