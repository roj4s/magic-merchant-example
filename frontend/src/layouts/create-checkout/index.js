import { FormControl } from "@mui/base";
import { Box, FormHelperText, FormLabel, Textarea, Typography } from "@mui/joy";
import "@magicpay/magicpay-js";
import { sendEventToChild } from "@magicpay/magicpay-js";
import env from "react-dotenv";

import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";

export default function CheckoutLayout() {
  const [orderData, setOrderData] = useState({});
  const [magicCheckoutData, setMagicCheckoutData] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [invalidJson, setInvalidJson] = useState(true);
  const url = `${env.API_URL}/api/checkout`;

  const myRef = useRef(null);

  useEffect(() => {
    if (!invalidJson)
      axios
        .post(url, orderData)
        .then((resp) => {
          if (resp.status === 200) {
            setMagicCheckoutData(resp.data);
          }
        })
        .catch((e) => {
          setApiError(e.message);
        });
  }, [orderData, invalidJson, url]);

  const parseJson = (data) => {
    try {
      const json = JSON.parse(data);
      setOrderData(json);
      setInvalidJson(false);
    } catch (e) {
      setInvalidJson(true);
    }
  };

  const onError = (data) => {
    console.log("Error Occured: ", data);
  };
  const onSuccess = useCallback(
    (data) => {
      console.log("Success: ", data);
      let response = {
        type: "ERROR_RESPONSE",
        message: "Unknown",
      };

      axios
        .get(
          `${env.API_URL}/api/complete_checkout/${magicCheckoutData["checkout_id"]}/`
        )
        .then((resp) => {
          if (resp.status === 200 || resp.status === 201) {
            response = {
              type: "SUCCESS_RESPONSE",
              message: "successful",
            };
          }
        })
        .catch((err) => {
          console.log(err);
          response = {
            type: "ERROR_RESPONSE",
            message: err.message,
          };
        })
        .finally(() => {
          sendEventToChild(response);
        });
    },
    [magicCheckoutData]
  );

  useEffect(() => {
    const element = myRef.current;
    if (element) {
      element.onSuccess = onSuccess;
      element.onError = onError;
    }
  }, [magicCheckoutData, onSuccess]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <FormControl error={invalidJson}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormLabel>
            <Typography sx={{ color: "white" }} level="h3">
              {" "}
              Order data{" "}
            </Typography>
          </FormLabel>
          <Textarea
            value={orderData}
            onChange={(evt) => parseJson(evt.target.value)}
            minRows={10}
            maxRows={10}
            placeholder="JSON here ... "
          />
          {invalidJson && (
            <FormHelperText>
              <Typography level="body-lg" color="warning">
                Invalid Json
              </Typography>
            </FormHelperText>
          )}
        </Box>
      </FormControl>

      {magicCheckoutData && (
        <Box
          sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}
        >
          <Typography sx={{ color: "white" }} level="body-lg">
            Pay with Magic
          </Typography>
          <magic-link
            checkoutId={magicCheckoutData.checkout_id}
            linkToken={magicCheckoutData.link_token}
            onSuccess={onSuccess}
            OnError={onError}
            ref={myRef}
            isSandbox
          />
        </Box>
      )}
      {apiError && (
        <Typography level="body-md" color="warning">
          {apiError}
        </Typography>
      )}
    </Box>
  );
}
