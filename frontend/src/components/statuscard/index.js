import { useMemo, useState, useEffect, useRef } from "react";
import { Box, Card, Typography } from "@mui/joy";
import { currentTheme } from "../../theme";

function useIsInViewport(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) =>
        setIsIntersecting(entry.isIntersecting)
      ),
    []
  );

  useEffect(() => {
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, observer]);

  return isIntersecting;
}

export default function StatusCard({ order, onViewPortVisible = () => {} }) {
  const refR = useRef(null);
  const refL = useRef(null);
  const inVpR = useIsInViewport(refR);
  const inVpL = useIsInViewport(refL);
  const activeBgColor = currentTheme.colors.secondaryLighter4;
  const inActiveBgColor = currentTheme.colors.backgroundSecondary;
  const [currentBgColor, setCurrentBgColor] = useState(activeBgColor);

  useEffect(() => {
    if (inVpR && inVpL) {
      setCurrentBgColor(activeBgColor);
      onViewPortVisible(order);
    } else {
      setCurrentBgColor(inActiveBgColor);
    }
  }, [inVpR, inVpL, activeBgColor, inActiveBgColor, order, onViewPortVisible]);

  return (
    <Box sx={{ display: "flex", position: "relative" }}>
      <Card
        sx={{
          backgroundColor: currentBgColor,
          boxShadow: "lg",
          width: "65vw",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ width: "50px" }}>
            <Typography
              level={"h4"}
              textColor={currentTheme.colors.textPrimary}
            >
              Pedido No. {order._id.slice(0, 7)}
            </Typography>
            <Typography
              level={"body"}
              textColor={currentTheme.colors.textPrimary}
            >
              {order.openDate}
            </Typography>
            <Typography
              level={"body-sm"}
              textColor={currentTheme.colors.textPrimary}
              sx={{
                marginTop: "10px",
                width: "10px",
                display: "inline-block",
                inlineSize: "60vw",
                overflowWrap: "break-word",
                wordBreak: "break-all",
                whiteSpace: "initial",
              }}
            >
              <b>Entrega em:</b> {order.clientData.address}
            </Typography>
            <Typography
              level={"body-sm"}
              textColor={currentTheme.colors.textPrimary}
            >
              <b>Telefone:</b> {order.clientData.phone}
            </Typography>
          </Box>
          <Typography
            sx={{ marginTop: "50px" }}
            level={"h3"}
            textColor={currentTheme.colors.textSecondary}
          >
            Total: {order.total.toFixed(2)}
          </Typography>
        </Box>
      </Card>
      <Box
        ref={refL}
        sx={{
          right: 0,
          position: "absolute",
          width: "10vw",
        }}
      ></Box>
      <Box
        ref={refR}
        sx={{
          left: 0,
          position: "absolute",
          width: "10vw",
        }}
      ></Box>
    </Box>
  );
}
