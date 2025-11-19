import React, { useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

interface FileUploadProps {
  onFileLoad: (content: string, filename: string) => void;
  isDark?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileLoad, isDark }) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFile = useCallback((file: File) => {
    if (file.type === 'application/json' || file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileLoad(content, file.name);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a JSON file (.json)');
    }
  }, [onFileLoad]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  return (
    <Box
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        border: isDragging ? '3px dashed #2196f3' : '2px dashed #666',
        borderRadius: 2,
        backgroundColor: isDragging 
          ? (isDark ? 'rgba(33, 150, 243, 0.1)' : 'rgba(33, 150, 243, 0.05)')
          : (isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'),
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        '&:hover': {
          borderColor: '#2196f3',
          backgroundColor: isDark ? 'rgba(33, 150, 243, 0.05)' : 'rgba(33, 150, 243, 0.03)',
        }
      }}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <UploadFileIcon sx={{ fontSize: 64, color: isDragging ? '#2196f3' : '#666', opacity: 0.7 }} />
      <Typography variant="h6" sx={{ color: isDark ? '#aaa' : '#666', fontWeight: 500 }}>
        {isDragging ? 'Drop JSON file here' : 'Drag & drop JSON file'}
      </Typography>
      <Typography variant="body2" sx={{ color: isDark ? '#888' : '#999' }}>
        or click to browse
      </Typography>
      <input
        id="file-input"
        type="file"
        accept=".json,application/json"
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />
    </Box>
  );
};

export default FileUpload;
