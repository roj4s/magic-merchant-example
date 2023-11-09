import { Modal, ModalClose, Typography, Sheet, Box } from "@mui/joy";

export default function BaseModal({ open, close, children, title }) {
  return (
    <Modal
      open={open}
      onClose={close}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
    >
      <Sheet
        variant="outlined"
        sx={{
          maxWidth: 500,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
        }}
      >
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <Typography
          component="h2"
          id="modal-title"
          level="h2"
          textColor="inherit"
          fontWeight="lg"
          mb={1}
        >
          {title}
        </Typography>
        <Box sx={{ mt: "20px" }}>{children}</Box>
      </Sheet>
    </Modal>
  );
}
