import { Box, Modal } from "@mui/joy";
import { CircularProgress } from "@mui/material";
import { useState } from "react";

export default function LoadingSpinner({ contained }) {
  const [open, setOpen] = useState(true);

  const onClose = (_, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };

  const payload = (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: contained ? null : "100vw",
        height: contained ? null : "100vh",
      }}
    >
      <CircularProgress />
    </Box>
  );

  if (contained) return payload;

  return (
    <Modal onClose={onClose} open={open}>
      {payload}
    </Modal>
  );
}
