import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getStudent } from "../lib/studentData";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";

interface LoginFormProps {
    onLoginSuccess: (student: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
    const [nationalId, setNationalId] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!nationalId) {
            setError('الرجاء إدخال الرقم القومي.');
            return;
        }

        try {
            const student = await getStudent(nationalId);
            if (student) {
                onLoginSuccess(student);
                // Optionally, navigate to student profile
                navigate('/student-profile');
            } else {
                setError('الرقم القومي غير موجود.');
            }
        } catch (err) {
            setError('فشل تسجيل الدخول. الرجاء المحاولة مرة أخرى.');
        }
    };

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>تسجيل الدخول</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nationalId">الرقم القومي</Label>
                        <Input
                            id="nationalId"
                            type="text"
                            value={nationalId}
                            onChange={(e) => setNationalId(e.target.value)}
                            placeholder="أدخل الرقم القومي"
                        />
                    </div>
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <CardFooter>
                        <Button type="submit">تسجيل الدخول</Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
};

export default LoginForm;
