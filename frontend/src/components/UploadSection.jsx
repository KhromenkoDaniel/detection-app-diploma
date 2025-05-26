import { Box, Button, IconButton, Paper, Stack, Typography } from '@mui/material';
import UploadFile from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function UploadSection({
  filePreview,
  dragActive,
  error,
  onFileChange,
  onDrop,
  onDragOver,
  onDragLeave,
  reset,
  onAnalyze,
  loading,
  file
}) {
  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <CloudUploadIcon />
        <Typography fontWeight={500}>Завантажити дані</Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Завантажте зображення для виявлення військової техніки
      </Typography>
      <Box
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        sx={{
          border: dragActive ? '2px solid #1976d2' : '2px dashed #bdbdbd',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          bgcolor: dragActive ? '#e3f2fd' : '#fafafa',
          transition: 'all 0.2s'
        }}
      >
        <input
          accept="image/jpeg,image/jpg,image/png"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={onFileChange}
        />
        <label htmlFor="raised-button-file">
          <Button
            component="span"
            variant="contained"
            startIcon={<UploadFile />}
            sx={{ mb: 2 }}
          >
            Завантажити зображення
          </Button>
        </label>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          або перетягніть файл у цю область
        </Typography>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        {filePreview && (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img
              src={filePreview}
              alt="preview"
              style={{ maxWidth: 200, maxHeight: 200, borderRadius: 8, marginBottom: 8, boxShadow: '0 2px 8px #0002' }}
            />
            <IconButton onClick={reset} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      </Box>
      {file && (
        <Button
          variant="contained"
          onClick={onAnalyze}
          disabled={loading}
          size="large"
          sx={{ mt: 2 }}
        >
          {loading ? 'Аналіз...' : 'Проаналізувати'}
        </Button>
      )}
    </Paper>
  );
}