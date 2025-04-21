
// دالة لتحويل النص إلى عنوان (أول حرف كبير لكل كلمة)
export const toTitleCase = (str: string): string => {
  if (!str) return str;
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// التحقق من صحة الاسم (حروف إنجليزية فقط)
export const validateName = (
  name: string, 
  fieldName: string, 
  setErrorForField: (fieldName: string, message: string) => void
): boolean => {
  const arabicPattern = /[\u0600-\u06FF]/;
  const englishLettersOnly = /^[a-zA-Z]+$/;
  
  if (!name) {
    setErrorForField(fieldName, `رجاءً املأ حقل الاسم ${fieldName === 'first' ? 'الأول' : fieldName === 'second' ? 'الثاني' : 'الثالث'} بالإنجليزي.`);
    return false;
  } else if (arabicPattern.test(name)) {
    setErrorForField(fieldName, `رجاءً أدخل الاسم ${fieldName === 'first' ? 'الأول' : fieldName === 'second' ? 'الثاني' : 'الثالث'} بالإنجليزي (حروف إنجليزية فقط).`);
    return false;
  } else if (!englishLettersOnly.test(name)) {
    setErrorForField(fieldName, `رجاءً أدخل الاسم ${fieldName === 'first' ? 'الأول' : fieldName === 'second' ? 'الثاني' : 'الثالث'} بحروف إنجليزية فقط (بدون أرقام أو رموز).`);
    return false;
  }
  return true;
};
