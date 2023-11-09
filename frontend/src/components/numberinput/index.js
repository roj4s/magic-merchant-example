import { Box, Button } from "@mui/joy";
import { useEffect, useState } from "react";

export default function NumberInput({
  onChange,
  plusBtnColor,
  minusBtnColor,
  hoverPlusBtnColor,
  hoverMinusBtnColor,
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (onChange) onChange(value);
  }, [value, onChange]);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Button
        disabled={value === 0}
        onClick={() => setValue(value === 0 ? 0 : value - 1)}
        size="sm"
        sx={{
          backgroundColor: value !== 0 ? minusBtnColor ?? "none" : "none",
          "&:active": {
            backgroundColor: hoverMinusBtnColor,
          },
          "&:hover": {
            backgroundColor: hoverMinusBtnColor,
          },
        }}
      >
        -
      </Button>
      {value}
      <Button
        onClick={() => setValue(value + 1)}
        size="sm"
        sx={{
          backgroundColor: plusBtnColor ?? "none",
          "&:active": {
            backgroundColor: hoverPlusBtnColor,
          },
          "&:hover": {
            backgroundColor: hoverPlusBtnColor,
          },
        }}
      >
        +
      </Button>
    </Box>
  );
}
