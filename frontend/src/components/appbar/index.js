import { Box, Typography } from "@mui/joy";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";

export default function AppBar({ title, linkTo }) {
  return (
    <Box
      sx={{
        top: 0,
        zIndex: 10,
        boxShadow: 15,
        //maxWidth: "100vw",
        p: 3,
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      {linkTo && (
        <Link to={linkTo}>
          <ArrowBackIcon />
        </Link>
      )}
      <Typography sx={{ maxWidth: "50vw" }} level="h3">
        {title}
      </Typography>
    </Box>
  );
}
