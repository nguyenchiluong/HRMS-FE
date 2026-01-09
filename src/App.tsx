import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import { Router } from './routes';
import { Toaster } from "sonner";

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Toaster position="top-right" richColors />
      <RouterProvider router={Router} />
    </Suspense>
  );
}

export default App;
