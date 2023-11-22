import { Box, Button, Chip, Table, Typography } from "@mui/joy";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppBar from "../../components/appbar";
import {
  getPurchases,
  requestRefund,
  setLoadingId,
  setRefundStatus,
  transferRefund,
} from "../../reducers/purchases";
import VerifyUserPage from "../verify_user";
import moment from "moment";

export default function Refund() {
  const disp = useDispatch();

  const purchaseState = useSelector((state) => state.purchases.data);
  console.log("purchase state", purchaseState);

  const auth_token = useSelector(
    (state) => state.user.otp_validation.auth_token
  );

  const reqRefund = (data) => {
    disp(setLoadingId(data.transaction_uuid));
    disp(requestRefund(data));
  };

  const setRefStatus = (data) => {
    disp(setLoadingId(data.transaction_uuid));
    disp(setRefundStatus(data));
  };

  const tranfsRef = (data) => {
    disp(setLoadingId(data.transaction_uuid));
    disp(transferRefund(data));
  };

  useEffect(() => {
    if (auth_token) {
      disp(getPurchases({ auth_token }));
    }
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
        <Table>
          <thead>
            <tr>
              <th>Purchase Id</th>
              <th>Date</th>
              <th>Status</th>
              <th>Refund Status</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {purchaseState.purchases.map((row) => {
              const refund = row.refund;
              const refundStatus = refund ? refund.status : "not open";

              return (
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
                    <Chip
                      color={
                        row.transaction_status === "not opened"
                          ? "danger"
                          : "success"
                      }
                    >
                      <Typography level="body-sm">
                        <b>{refundStatus}</b>
                      </Typography>
                    </Chip>
                  </td>
                  <td>
                    <Typography level="body-sm">
                      {parseFloat(row.amount.toFixed(2)).toLocaleString(
                        "us-US",
                        {
                          style: "currency",
                          currency: "USD",
                        }
                      )}
                    </Typography>
                  </td>
                  <td>
                    {!refund && (
                      <Button
                        loading={
                          purchaseState.loadingId === row.transaction_uuid
                        }
                        onClick={() => reqRefund(row)}
                      >
                        Request Refund
                      </Button>
                    )}
                    {refund && refund.status === "approved" && (
                      <Button
                        onClick={() => tranfsRef({ ...row, id: refund.id })}
                        loading={
                          purchaseState.loadingId === row.transaction_uuid
                        }
                      >
                        Transfer
                      </Button>
                    )}
                    {refund && refund.status === "pending" && (
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexDirection: "column",
                        }}
                      >
                        <Button
                          onClick={() =>
                            setRefStatus({
                              ...row,
                              status: "approved",
                              id: refund.id,
                            })
                          }
                          loading={
                            purchaseState.loadingId === row.transaction_uuid
                          }
                        >
                          Aprove
                        </Button>
                        <Button
                          onClick={() =>
                            setRefundStatus({
                              ...row,
                              status: "rejected",
                              id: refund.id,
                            })
                          }
                          color="danger"
                          loading={
                            purchaseState.loadingId === row.transaction_uuid
                          }
                        >
                          Reject
                        </Button>
                      </Box>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Box>
    </Box>
  );
}
