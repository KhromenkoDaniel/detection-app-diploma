import {
  Paper,
  Stack,
  Typography,
  Divider,
  Card,
  CardMedia,
  CardContent,
  Button,
} from "@mui/material";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ResultSection({ result, onReset }) {
  // нічого ще не аналізували
  if (!result) {
    return (
      <Paper elevation={2} sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          <ImageSearchIcon />
          <Typography fontWeight={500}>Результат детекції техніки</Typography>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="subtitle1" fontWeight={500}>
          Нема зображення
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <ImageSearchIcon />
        <Typography fontWeight={500}>Результат детекції техніки</Typography>
      </Stack>
      <Divider sx={{ mb: 2 }} />

      {/* картинка‑оверлей */}
      <Card sx={{ maxWidth: 600, mx: "auto" }}>
        <CardMedia
          component="img"
          image={result.image}          // рядок data:image/png;base64,...
          sx={{ objectFit: "contain" }}
        />

        {/* список знайдених об’єктів і впевненість */}
        <CardContent>
          {result.predictions.length ? (
            result.predictions.map((p, idx) => (
              <Typography key={idx} variant="body2">
                {p.class} —{" "}
                <strong>{(p.confidence * 100).toFixed(1)} %</strong>
              </Typography>
            ))
          ) : (
            <Typography variant="body2">Об’єктів не знайдено</Typography>
          )}

          <Button
            onClick={onReset}
            variant="outlined"
            startIcon={<DeleteIcon />}
            sx={{ mt: 2 }}
          >
            Спробувати ще раз
          </Button>
        </CardContent>
      </Card>
    </Paper>
  );
}
