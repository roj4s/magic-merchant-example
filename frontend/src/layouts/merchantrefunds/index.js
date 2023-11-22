import { Box, Button, Chip, Table, Typography } from "@mui/joy";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppBar from "../../components/appbar";
import { getPurchases } from "../../reducers/refund";
import VerifyUserPage from "../verify_user";
import moment from "moment";

export default function Refund() {
  const disp = useDispatch();

  const purchases = useSelector((state) => state.refund.data.purchases);
  const auth_token = useSelector(
    (state) => state.user.otp_validation.auth_token
  );

  useEffect(() => {
    if (auth_token) disp(getPurchases({ auth_token }));
  }, [auth_token, disp]);

  if (!auth_token) return <VerifyUserPage redirectTo={"/refund"} />;

  return (
    <Box>
      <AppBar title={"Refund"} linkTo={"/"} />
      <Box
        sx={{
          display: "flex",
          gap: 2,
          padding: "50px",
          flexDirection: "column",
        }}
      >
        <Typography level="h4">Purchases</Typography>
        <Table sx={{ "& tr > *:not(:first-child)": { textAlign: "right" } }}>
          <thead>
            <tr>
              <th>Purchase Id</th>
              <th>Date</th>
              <th>Status</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((row) => (
              <tr key={row.id}>
                <td>
                  <Typography level="body-sm">
                    <b>{row.transaction_uuid.slice(0, 10)}</b>
                  </Typography>
                </td>
                <td>
                  <Typography level="body-sm">
                    {moment(row.transaction_date_time).format("YYYY-MM-DD")}
                  </Typography>
                </td>
                <td>
                  <Chip
                    color={
                      row.transaction_status === "pending"
                        ? "danger"
                        : "success"
                    }
                  >
                    <Typography level="body-sm">
                      <b>{row.transaction_status}</b>
                    </Typography>
                  </Chip>
                </td>
                <td>
                  <Typography level="body-sm">
                    {parseFloat(row.amount.toFixed(2)).toLocaleString("us-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </Typography>
                </td>
                <td>
                  <Button>Refund</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>
    </Box>
  );
}
