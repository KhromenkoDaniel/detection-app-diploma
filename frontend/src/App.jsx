import { useState } from 'react';
import { CssBaseline, Container, Typography } from '@mui/material';
import { useImageUpload } from './hooks/useImageUpload';
import UploadSection from './components/UploadSection';
import ResultSection from './components/ResultSection';

export default function App() {
  const {
    file,
    filePreview,
    error,
    dragActive,
    onFileChange,
    onDrop,
    onDragOver,
    onDragLeave,
    reset
  } = useImageUpload();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
  
    const form = new FormData();
    form.append("file", file);
  
    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error(await res.text());
  
      const json = await res.json();
      console.log("Back‑response =", json);          // ← бачимо рядок
      setResult(json);                         // рядок, а не об’єкт
    } catch (e) {
      console.error(e);
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };
  

  const handleReset = () => {
    reset();
    setResult(null);
  };

  return (
    <>
      <CssBaseline />
      <Container 
        maxWidth="md" 
        sx={{ 
          minHeight: '100vh',
          py: 4
        }}
      >
          <Typography variant="h5" fontWeight={600} mb={3}>
            Виявлення військової техніки за допомогою моделі YOLOv11
          </Typography>
          <UploadSection
            filePreview={filePreview}
            dragActive={dragActive}
            error={error}
            onFileChange={onFileChange}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            reset={handleReset}
            onAnalyze={analyze}
            loading={loading}
            file={file}
          />
          <ResultSection
            result={result}
            onReset={handleReset}
          />
        </Container>
    </>
  );
}
