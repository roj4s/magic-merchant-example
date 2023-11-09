import * as React from "react";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import { Box } from "@mui/system";
import { Button, Chip } from "@mui/joy";
import { currentTheme } from "../../theme";
import { useSelector, useDispatch } from "react-redux";
import { addProduct } from "../../reducers/order";
import { useEffect, useState } from "react";

export default function ProductCard({
  _id,
  image,
  name,
  price,
  step,
  shortDescription,
  quantity = 0,
}) {
  const [q, setQ] = useState(quantity);
  const orderProductsState = useSelector(
    (state) => state.order.orders[state.order.activeOrder].products
  );
  const disp = useDispatch();

  const updateQ = (sub) => {
    const actualStep = step ?? 1;
    let newQ = q + actualStep;
    if (sub) {
      newQ = q - actualStep;
      newQ = newQ < 0 ? 0 : newQ;
    }

    disp(addProduct({ _id, quantity: newQ, price, name, step, image }));
    setQ(newQ);
  };

  useEffect(() => {
    if (_id in orderProductsState) {
      setQ(orderProductsState[_id].quantity);
    } else {
      setQ(0);
    }
  }, [orderProductsState, _id]);

  return (
    <Card
      orientation="vertical"
      sx={{
        backgroundColor: currentTheme.colors.primary,
        width: { xs: "40%", sm: "40%", md: "250px", lg: "250px" },
      }}
      variant="outlined"
    >
      <Box sx={{ position: "relative" }}>
        {q !== 0 && (
          <Chip
            sx={{
              position: "absolute",
              bottom: "5px",
              right: "5px",
              color: currentTheme.colors.secondary,
            }}
            size="sm"
          >
            <b>{q}</b>
          </Chip>
        )}
        <img
          src={image}
          loading="lazy"
          alt=""
          style={{
            borderRadius: "5px",
            width: "100%",
            height: "100%",
            backgroundSize: "cover",
          }}
        />
      </Box>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
          }}
        >
          <Box
            sx={{ display: "flex", flexDirection: "column", maxWidth: "500px" }}
          >
            <Box
              sx={{
                maxWidth: { xs: "250px", sm: "250px", md: "150px" },
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "inline",
              }}
            >
              <Typography level="title-lg">{name}</Typography>
            </Box>
            <Typography level="title-md">{shortDescription}</Typography>
            <Typography level="body-sm">
              <b>
                {parseFloat(price).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </b>
            </Typography>
          </Box>
          <Box
            sx={{
              gap: 1,
              display: "flex",
              marginLeft: "auto",
              marginTop: "auto",
            }}
          >
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => updateQ(true)}
              size="sm"
            >
              -
            </Button>
            <Button
              size="sm"
              variant="solid"
              sx={{
                backgroundColor: currentTheme.colors.secondary,
                "&:active": {
                  backgroundColor: currentTheme.colors.secondaryLighter,
                },
              }}
              onClick={() => updateQ()}
            >
              +
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
