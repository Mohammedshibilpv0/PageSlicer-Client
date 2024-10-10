import  { useEffect } from 'react';
import { PDFUploadContainer } from "./pdf";

function App() {

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';  
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <>
      <PDFUploadContainer />
    </>
  );
}

export default App;
