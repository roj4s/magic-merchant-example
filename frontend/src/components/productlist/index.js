import { Box } from "@mui/system";
import React from "react";
import ProductCard from "../productcard";
import { Typography } from "@mui/joy";
import { currentTheme } from "../../theme";

export default function ProductList({
  data,
  showTitle = true,
  fullWidth = false,
}) {
  return (
    <Box
      sx={{
        gap: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {showTitle && (
        <Typography
          level="h4"
          textColor={currentTheme.colors.textPrimary}
          sx={{ marginRight: "auto" }}
        >
          Products
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {data.map((product, i) => (
          <ProductCard
            key={`product-${i}`}
            {...product}
            fullWidth={fullWidth}
          />
        ))}
      </Box>
    </Box>
  );
}
