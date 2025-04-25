import axios, { AxiosError } from 'axios';

// إنشاء مثيل Axios مع إعدادات افتراضية (بدون .env)
const api = axios.create({
  baseURL: 'https://youssefabdelrhim41.pythonanywhere.com/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// واجهة بيانات الطالب
export interface StudentData {
  code: string;
  arabic_name: string;
  seat_number: string;
  national_id: string;
  english_name: string | null;
  photo: string | null;
}

// دالة مساعدة لاستخراج رسالة الخطأ
const getErrorMessage = (error: AxiosError): string => {
  const responseData = error.response?.data as any;
  console.log('Full error response:', responseData);
  if (responseData) {
    if (responseData.error) return responseData.error;
    if (responseData.detail) return responseData.detail;
    if (responseData.message) return responseData.message;
    if (responseData.msg) return responseData.msg;
    if (typeof responseData === 'object') {
      const errors = Object.values(responseData).flat().join(', ');
      if (errors) return errors;
    }
    return JSON.stringify(responseData);
  }
  return error.message || 'حدث خطأ غير معروف.';
};

// تسجيل دخول الطالب
export const loginStudent = async (seat_number: string): Promise<StudentData> => {
  try {
    console.log('Sending login payload:', { seat_number });
    const response = await api.post('login/', { seat_number });
    console.log('Logged in student:', response.data);
    return response.data;
  } catch (error: any) {
    const err = error as AxiosError;
    console.error('Error logging in:', err.response?.data || err.message);
    throw new Error(getErrorMessage(err) || 'فشل تسجيل الدخول. تحقق من رقم القومي.');
  }
};

// جلب بيانات الطالب
export const getStudent = async (identifier: string): Promise<StudentData> => {
  try {
    console.log('Fetching student with identifier:', identifier);
    const response = await api.get(`students/${identifier}/`);
    console.log('Fetched student:', response.data);
    return response.data;
  } catch (error: any) {
    const err = error as AxiosError;
    console.error('Error fetching student:', err.response?.data || err.message);
    throw new Error(getErrorMessage(err) || 'فشل جلب بيانات الطالب.');
  }
};

// تحديث بيانات الطالب
export const updateStudent = async (identifier: string, data: FormData): Promise<StudentData> => {
  try {
    console.log('Updating student with identifier:', identifier);
    const response = await api.post(`students/${identifier}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Updated student:', response.data);
    return response.data.data; // افتراض أن الـ API يرجع { message, data }
  } catch (error: any) {
    const err = error as AxiosError;
    console.error('Error updating student:', err.response?.data || err.message);
    throw new Error(getErrorMessage(err) || 'فشل تحديث بيانات الطالب.');
  }
};
