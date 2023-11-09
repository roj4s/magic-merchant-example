import { Box, Card, CircularProgress, Divider, Typography } from "@mui/joy";
import { currentTheme } from "../../theme";
import Done from "@mui/icons-material/Done";

export default function StatusCard({
  statusList = ["Processing"],
  activeStatus = 0,
  completedIndexes = [],
}) {
  return (
    <Card sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Typography level={"h3"} textColor={currentTheme.colors.textPrimary}>
        Estado do pedido
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `${[...Array(statusList.length)]
            .map((_) => "1fr 1fr 1fr 1fr")
            .join(" 1px ")}`,
          gridTemplateRows: "2fr 1fr",
          width: "95%",
          height: "100px",
        }}
      >
        {statusList.map((status, i) => {
          return (
            <Box
              key={`firstRow-${status}`}
              sx={{
                gridColumn: `${5 * i + 2} / span 2`,
                gridRow: `1 / span 1`,
                mx: "auto",
                my: "auto",
              }}
            >
              {i !== statusList.length - 1 && (
                <Box>
                  {completedIndexes.includes(i) ? (
                    <CircularProgress
                      sx={{
                        "--CircularProgress-progressColor":
                          currentTheme.colors.secondary,
                        color: currentTheme.colors.secondary,
                      }}
                      value={100}
                    >
                      <Done />
                    </CircularProgress>
                  ) : (
                    <CircularProgress
                      sx={{
                        "--CircularProgress-progressColor":
                          currentTheme.colors.secondary,
                        color: currentTheme.colors.secondary,
                      }}
                      determinate={i !== activeStatus}
                    />
                  )}
                </Box>
              )}
              {i === statusList.length - 1 && (
                <Box
                  sx={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: completedIndexes.includes(
                      statusList.length - 1
                    )
                      ? currentTheme.colors.secondary
                      : currentTheme.colors.backgroundSecondary,
                    borderRadius: 100,
                  }}
                ></Box>
              )}
            </Box>
          );
        })}
        {statusList.map((status, i) => {
          return (
            <Box
              key={`secondRow-${status}`}
              sx={{
                gridColumn: `${i * 5 + 1} / span 4`,
                gridRow: `2 / span 1`,
                mx: "auto",
                my: "auto",
              }}
            >
              {status}
            </Box>
          );
        })}
        {[...Array(statusList.length - 1)].map((_, i) => {
          return (
            <Box
              sx={{
                gridColumn: `${i * 5 + 4} / span 3`,
                gridRow: "1/ span 5px",
                mx: "auto",
                my: "auto",
              }}
            >
              <Divider sx={{ width: "20px" }} />
            </Box>
          );
        })}
      </Box>
    </Card>
  );
}
