import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import ProfilePictureUpload from '@/components/ProfilePictureUpload';
import NameInput from '@/components/NameInput';
import { useErrorTimeout } from '@/hooks/useErrorTimeout';
import { validateName, toTitleCase } from '@/utils/nameUtils';
import { getStudent, updateStudent } from '@/lib/studentData';

interface StudentData {
  nationalId: string;
  arabicName: string;
  examSeatNumber: string;
  studentCode: string;
  englishFirstName?: string;
  englishSecondName?: string;
  englishThirdName?: string;
  profilePicture?: string | null;
  canEditAgain: boolean;
}

const StudentProfile = () => {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureError, setProfilePictureError] = useErrorTimeout('', 5000);
  const navigate = useNavigate();

  const [englishFirstName, setEnglishFirstName] = useState('');
  const [englishSecondName, setEnglishSecondName] = useState('');
  const [englishThirdName, setEnglishThirdName] = useState('');

  const [firstNameError, setFirstNameError] = useErrorTimeout('', 5000);
  const [secondNameError, setSecondNameError] = useErrorTimeout('', 5000);
  const [thirdNameError, setThirdNameError] = useErrorTimeout('', 5000);

  useEffect(() => {
    const storedStudent = localStorage.getItem('currentStudent');
    if (!storedStudent) {
      toast.error("الرجاء تسجيل الدخول أولاً");
      navigate('/login');
      return;
    }

    const fetchStudentData = async () => {
      try {
        const parsedStudent = JSON.parse(storedStudent);
        const studentData = await getStudent(parsedStudent.nationalId || parsedStudent.examSeatNumber);
        const updatedStudent: StudentData = {
          nationalId: studentData.national_id,
          arabicName: studentData.arabic_name,
          examSeatNumber: studentData.seat_number,
          studentCode: studentData.code,
          englishFirstName: studentData.english_name?.split(' ')[0] || '',
          englishSecondName: studentData.english_name?.split(' ')[1] || '',
          englishThirdName: studentData.english_name?.split(' ')[2] || '',
          profilePicture: studentData.photo || null,
          canEditAgain: studentData.can_edit_again || false,
        };

        localStorage.setItem('currentStudent', JSON.stringify(updatedStudent));
        setStudent(updatedStudent);

        setEnglishFirstName(updatedStudent.englishFirstName || '');
        setEnglishSecondName(updatedStudent.englishSecondName || '');
        setEnglishThirdName(updatedStudent.englishThirdName || '');

        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching student data:", error.message);
        toast.error(error.message || 'فشل تحميل بيانات الطالب. حاول مرة أخرى.');
        localStorage.removeItem('currentStudent');
        navigate('/login');
      }
    };

    fetchStudentData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentStudent');
    toast.success("تم تسجيل الخروج بنجاح");
    navigate('/login');
  };

  const handleProfilePictureChange = (file: File | null) => {
    if (!student?.canEditAgain) {
      setProfilePictureError('لا يمكن تغيير الصورة بدون إذن الأدمن.');
      setProfilePicture(null);
      return;
    }

    setProfilePicture(file);
    if (!file) {
      setProfilePictureError('');
    }
  };

  const handleSubmit = async () => {
    if (!student?.canEditAgain) {
      toast.error('غير مسموح بتعديل البيانات بدون إذن الأدمن.');
      return;
    }

    if (!profilePicture && !student.profilePicture) {
      setProfilePictureError('الرجاء اختيار صورة شخصية قبل الحفظ.');
      return;
    }

    if (profilePicture && !(profilePicture instanceof File)) {
      setProfilePictureError('الصورة المختارة غير صالحة. اختر صورة أخرى.');
      return;
    }

    // Additional validation to ensure file is valid
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
    const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
    if (profilePicture && !ALLOWED_FILE_TYPES.includes(profilePicture.type)) {
      setProfilePictureError('يجب أن تكون الصورة بصيغة JPG أو PNG.');
      setProfilePicture(null);
      return;
    }
    if (profilePicture && profilePicture.size > MAX_FILE_SIZE) {
      setProfilePictureError('حجم الصورة يجب ألا يتجاوز 2 ميغابايت.');
      setProfilePicture(null);
      return;
    }

    const formattedFirstName = toTitleCase(englishFirstName.trim());
    const formattedSecondName = toTitleCase(englishSecondName.trim());
    const formattedThirdName = toTitleCase(englishThirdName.trim());
    const fullEnglishName = `${formattedFirstName} ${formattedSecondName} ${formattedThirdName}`.trim();

    const isFirstNameValid = validateName(formattedFirstName, 'first', (fieldName, message) => {
      if (fieldName === 'first') setFirstNameError(message);
    });
    const isSecondNameValid = validateName(formattedSecondName, 'second', (fieldName, message) => {
      if (fieldName === 'second') setSecondNameError(message);
    });
    const isThirdNameValid = validateName(formattedThirdName, 'third', (fieldName, message) => {
      if (fieldName === 'third') setThirdNameError(message);
    });

    if (isFirstNameValid && isSecondNameValid && isThirdNameValid && student) {
      try {
        const formData = new FormData();
        formData.append('english_name', fullEnglishName);
        if (profilePicture) {
          formData.append('photo', profilePicture, profilePicture.name);
        }

        const identifier = student.examSeatNumber;
        console.log('Sending FormData:', {
          english_name: fullEnglishName,
          photo: profilePicture ? profilePicture.name : 'No new photo',
          size: profilePicture ? profilePicture.size : 'N/A',
          type: profilePicture ? profilePicture.type : 'N/A',
        });

        const response = await updateStudent(identifier, formData);

        const updatedStudent = {
          ...student,
          englishFirstName: formattedFirstName,
          englishSecondName: formattedSecondName,
          englishThirdName: formattedThirdName,
          profilePicture: response.photo,
          canEditAgain: response.can_edit_again || false,
        };
        localStorage.setItem('currentStudent', JSON.stringify(updatedStudent));
        setStudent(updatedStudent);

        toast.success(`تم حفظ البيانات والصورة بنجاح باسم ${student.studentCode}.jpg`);
      } catch (error: any) {
        console.error('Submission error:', error.message);
        const errorMessage = error.message || 'فشل حفظ البيانات. حاول مرة ateliers أخرى.';
        setProfilePictureError(errorMessage);
        toast.error(errorMessage);
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
                <p className="text-lg">{student.arabicName || 'غير متوفر'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-500 mb-1">رقم الجلوس</h3>
                <p className="text-lg">{student.examSeatNumber || 'غير متوفر'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-500 mb-1">كود الطالب</h3>
                <p className="text-lg">{student.studentCode || 'غير متوفر'}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="font-semibold text-gray-500 mb-1">الرقم القومي</h3>
                <p className="text-lg">{student.nationalId || 'غير متوفر'}</p>
              </div>
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
                setError={setProfilePictureError}
                error={profilePictureError}
                disabled={!student.canEditAgain}
                studentId={student.nationalId}
                existingPhotoUrl={student.profilePicture}
              />
              {student.profilePicture && (
                <p className="mt-4 text-center">
                  اسم الملف: {student.studentCode}.jpg
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
              id="english-first-name"
              label="الاسم الأول بالإنجليزي"
              value={englishFirstName}
              onChange={(e) => setEnglishFirstName(e.target.value)}
              error={firstNameError}
              disabled={!student.canEditAgain}
            />
            <NameInput
              id="english-second-name"
              label="الاسم الثاني بالإنجليزي"
              value={englishSecondName}
              onChange={(e) => setEnglishSecondName(e.target.value)}
              error={secondNameError}
              disabled={!student.canEditAgain}
            />
            <NameInput
              id="english-third-name"
              label="الاسم الثالث بالإنجليزي"
              value={englishThirdName}
              onChange={(e) => setEnglishThirdName(e.target.value)}
              error={thirdNameError}
              disabled={!student.canEditAgain}
            />
          </CardContent>
        </Card>
      </div>

      {student.canEditAgain && (
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
