
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="container mx-auto py-12 px-4 text-center">
      <h1 className="text-4xl font-bold mb-6">أهلاً بكم في بوابة تسجيل الطلاب الإلكترونية</h1>
      <p className="text-lg text-gray-600 mb-8"> للمعهد العالي للخدمة الاجتماعية بالإسكندرية</p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link to="/login">
          <Button size="lg">
            تسجيل الدخول
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;

