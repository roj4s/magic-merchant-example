import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import { currentTheme } from "../../theme";
import React, { useState } from "react";

export default function CategoriesImageBox({
  data,
  onCategoryChecked = () => {},
}) {
  const [checkedList, setChekedList] = useState([]);

  const check = (title) => {
    const checked = !checkedList.includes(title);

    if (!checked) {
      setChekedList(checkedList.filter((i) => i !== title));
    } else {
      setChekedList([...checkedList, title]);
    }

    onCategoryChecked(title, checked);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ display: "flex", margin: "20px" }}>
        <Typography
          level="h4"
          textColor={currentTheme.colors.textPrimary}
          sx={{ marginRight: "auto" }}
        >
          Categories
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: "row",
          whiteSpace: "nowrap",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          msOverflowStyle: "none",
          width: "100%",
          boxSizing: "border-box",
          overflow: "auto",
          padding: "0px 20px 0px",
        }}
      >
        {data
          .sort((a, b) => (a.title.length < b.title.length ? 1 : -1))
          .map((item, i) => (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <img
                style={{
                  borderRadius: "50%",
                  width: "80px",
                  height: "80px",
                  border: checkedList.includes(item.title)
                    ? `3px solid ${currentTheme.colors.secondary}`
                    : null,
                }}
                src={item.image}
                alt={item.title}
                onClick={() => check(item.title)}
              />
              <Typography level="title-sm" sx={{ mx: "auto" }}>
                {item.title}
              </Typography>
            </Box>
          ))}
      </Box>
    </Box>
  );
}
