import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import StudentForm from './pages/StudentForm';
import Login from './pages/Login';
import StudentProfile from './pages/StudentProfile';
import './index.css';

const queryClient = new QueryClient();

const App = () => (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/student-form" element={<StudentForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/student-profile" element={<StudentProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>
);

createRoot(document.getElementById('root')!).render(<App />);