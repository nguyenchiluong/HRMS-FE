import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import { Router } from './routes';

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RouterProvider router={Router} />
    </Suspense>
  );
}

export default App;
