import { useState, useCallback } from 'react';

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export function useImageUpload() {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const isImageFile = useCallback((file) => {
    return file && ACCEPTED_TYPES.includes(file.type);
  }, []);

  const handleFile = useCallback((file) => {
    if (!isImageFile(file)) {
      setError('Дозволено лише файли зображень: jpg, jpeg, png');
      setFile(null);
      setFilePreview(null);
      return;
    }
    setError('');
    setFile(file);
    setFilePreview(URL.createObjectURL(file));
  }, [isImageFile]);

  const onFileChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const reset = useCallback(() => {
    setFile(null);
    setFilePreview(null);
    setError('');
  }, []);

  return {
    file,
    filePreview,
    error,
    dragActive,
    onFileChange,
    onDrop,
    onDragOver,
    onDragLeave,
    reset,
  };
}