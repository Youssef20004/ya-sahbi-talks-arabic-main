
import axios from 'axios';

const API_URL = 'https://egyption549.pythonanywhere.com/api/'; // أو 'https://your-api-server.com/api/'

export interface StudentData {
  code: string;
  arabic_name: string;
  seat_number: string;
  national_id: string;
  english_name: string | null;
  photo: string | null;
}

export const loginStudent = async (seat_number: string): Promise<StudentData> => {
  try {
    const response = await axios.post(`${API_URL}login/`, { seat_number });
    console.log('Logged in student:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error logging in:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'فشل تسجيل الدخول. تحقق من رقم الجلوس.');
  }
};

export const getStudent = async (identifier: string): Promise<StudentData> => {
  try {
    const response = await axios.get(`${API_URL}students/${identifier}/`);
    console.log('Fetched student:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching student:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'فشل جلب بيانات الطالب.');
  }
};

export const updateStudent = async (identifier: string, data: FormData): Promise<StudentData> => {
  try {
    const response = await axios.post(`${API_URL}students/${identifier}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('Updated student:', response.data);
    return response.data.data; // الـ API بيرجّع { message, data }
  } catch (error: any) {
    console.error('Error updating student:', error.response?.data || error.message);
    throw error; // رمي الخطأ كما هو لمعالجته في StudentProfile.tsx
  }
};
