import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { getStudent } from '@/lib/studentData';

const Login = () => {
  const [nationalId, setNationalId] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateNationalId = (id: string) => {
    return /^\d{14}$/.test(id);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!nationalId) {
      setError('برجاء إدخال الرقم القومي');
      return;
    }

    if (!validateNationalId(nationalId)) {
      setError('الرقم القومي يجب أن يكون 14 رقم');
      return;
    }

    setLoading(true);

    try {
      const student = await getStudent(nationalId);
      localStorage.setItem('currentStudent', JSON.stringify({
        nationalId: student.national_id,
        arabicName: student.arabic_name,
        examSeatNumber: student.seat_number,
        studentCode: student.code,
        englishFirstName: student.english_name?.split(' ')[0] || '',
        englishSecondName: student.english_name?.split(' ')[1] || '',
        englishThirdName: student.english_name?.split(' ')[2] || '',
        profilePicture: student.photo || null,
      }));
      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: `مرحباً بك ${student.arabic_name}`,
      });
      setAttempts(0);
      navigate('/student-profile');
    } catch (error: any) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts < 3) {
        setError(`الرقم القومي غير مسجل في النظام. لديك ${3 - newAttempts} محاولة/محاولات متبقية.`);
      } else {
        setError(
          'عذرًا، لقد تجاوزت عدد المحاولات المسموح بها. رقمك غير موجود في النظام. رجاءً توجه إلى قسم الشؤون بالمعهد لتسجيل بياناتك.'
        );
        setIsDisabled(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setNationalId('');
    setAttempts(0);
    setError('');
    setIsDisabled(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="w-24 h-24 mx-auto mb-4">
            <img
              src="/placeholder.svg"
              alt="شعار المعهد"
              className="w-full h-full object -contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            نظام تسجيل بيانات الطلاب
          </CardTitle>
          <p className="text-muted-foreground">
            قم بإدخال الرقم القومي لتسجيل الدخول
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="nationalId" className="block text-sm font-medium">
                الرقم القومي
              </label>
              <Input
                id="nationalId"
                type="text"
                placeholder="أدخل الرقم القومي المكون من 14 رقم"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                className="text-center text-lg tracking-wide"
                dir="ltr"
                maxLength={14}
                disabled={isDisabled}
              />
              {error && attempts < 3 && (
                <p className="text-destructive text-sm">{error}</p>
              )}
              {error && attempts >= 3 && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || isDisabled || !nationalId}
            >
              {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center pt-0">
          {isDisabled ? (
            <Button variant="outline" onClick={handleReset}>
              إعادة المحاولة
            </Button>
          ) : (
            <p className="text-xs text-muted-foreground">
              يمكنك استخدام 77223344556611 للدخول كطالب اختبار
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
