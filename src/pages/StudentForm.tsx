import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import ProfilePictureUpload from '@/components/ProfilePictureUpload';
import NameInput from '@/components/NameInput';
import FormSubmissionStatus from '@/components/FormSubmissionStatus';
import { useErrorTimeout } from '@/hooks/useErrorTimeout';
import { validateName, toTitleCase } from '@/utils/nameUtils';
import { getStudent, updateStudent, StudentData } from '@/lib/studentData';

const StudentProfile: React.FC = () => {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureError, setProfilePictureError] = useErrorTimeout('', 5000);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [englishName, setEnglishName] = useState('');
  const [englishNameError, setEnglishNameError] = useErrorTimeout('', 5000);
  const navigate = useNavigate();

  useEffect(() => {
    const storedStudent = localStorage.getItem('currentStudent');
    if (!storedStudent) {
      toast.error('الرجاء تسجيل الدخول أولاً');
      navigate('/login');
      return;
    }

    try {
      const parsedStudent = JSON.parse(storedStudent);
      setStudent(parsedStudent);
      setEnglishName(parsedStudent.english_name || '');
      setFormSubmitted(!!parsedStudent.english_name || !!parsedStudent.photo);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing student data:', error);
      localStorage.removeItem('currentStudent');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentStudent');
    toast.success('تم تسجيل الخروج بنجاح');
    navigate('/login');
  };

  const handleProfilePictureChange = (file: File | null) => {
    if (file && !formSubmitted) {
      setProfilePicture(file);
    } else {
      setProfilePicture(null);
    }
  };

  const handleSubmit = async () => {
    if (!profilePicture) {
      setProfilePictureError('الرجاء اختيار صورة شخصية قبل الحفظ.');
      return;
    }

    const formattedName = toTitleCase(englishName.trim());
    const isNameValid = validateName(formattedName, 'english_name', (fieldName, message) => {
      if (fieldName === 'english_name') setEnglishNameError(message);
    });

    if (isNameValid && student) {
      try {
        const formData = new FormData();
        formData.append('english_name', formattedName);
        formData.append('photo', profilePicture);

        const updatedStudent = await updateStudent(student.national_id, formData);
        localStorage.setItem('currentStudent', JSON.stringify(updatedStudent));
        setStudent(updatedStudent);
        setFormSubmitted(true);
        toast.success('تم حفظ البيانات والصورة بنجاح!');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'فشل حفظ البيانات.');
      }
    }
  };

  if (loading) {
    return <div className="container mx-auto py-12 text-center">جارٍ التحميل...</div>;
  }

  if (!student) {
    return <div className="container mx-auto py-12 text-center">خطأ في تحميل بيانات الطالب</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">الملف الشخصي</h1>
        <Button variant="outline" onClick={handleLogout}>تسجيل الخروج</Button>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">بيانات الطالب</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-500 mb-1">الاسم بالعربي</h3>
                <p className="text-lg">{student.arabic_name}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-500 mb-1">رقم الجلوس</h3>
                <p className="text-lg">{student.seat_number}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-500 mb-1">كود الطالب</h3>
                <p className="text-lg">{student.code}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="font-semibold text-gray-500 mb-1">الرقم القومي</h3>
                <p className="text-lg">{student.national_id}</p>
              </div>
              <FormSubmissionStatus formSubmitted={formSubmitted} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">الصورة الشخصية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center relative">
              <ProfilePictureUpload
                setProfilePicture={handleProfilePictureChange}
                error={profilePictureError}
                disabled={formSubmitted}
                studentId={student.national_id}
              />
              {formSubmitted && (
                <p className="mt-4 text-center">
                  تم حفظ الصورة بنجاح<br />
                  اسم الملف: {student.code}.jpg
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">الاسم بالإنجليزي</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <NameInput
              id="english-name"
              label="الاسم بالإنجليزي"
              value={englishName}
              onChange={(e) => setEnglishName(e.target.value)}
              error={englishNameError}
              disabled={formSubmitted}
            />
          </CardContent>
        </Card>
      </div>

      {!formSubmitted && (
        <div className="mt-6 flex justify-center">
          <Button onClick={handleSubmit} size="lg">
            حفظ البيانات
          </Button>
        </div>
      )}

      <div className="mt-6 text-center">
        <Link to="/">
          <Button variant="outline">العودة للصفحة الرئيسية</Button>
        </Link>
      </div>
    </div>
  );
};

export default StudentProfile;