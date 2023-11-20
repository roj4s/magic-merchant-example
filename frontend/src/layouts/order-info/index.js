import {
  Box,
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  Switch,
  Typography,
} from "@mui/joy";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../../reducers/user";
import { currentTheme } from "../../theme";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import OrderTable from "../../components/ordertable";
import { updateCurrentOrder } from "../../reducers/order";
import get_formated_data from "./get-formated-data";
import axios from "axios";
import env from "react-dotenv";
import "@magicpay/magicpay-js";
import { sendEventToChild } from "@magicpay/magicpay-js";
import { clear } from "../../reducers/order";
import { clear as clearUserData } from "../../reducers/user";
import BaseModal from "../../components/basemodal";
import AppBar from "../../components/appbar";
import { useNavigate } from "react-router-dom";

export default function OrderInfo() {
  const userData = useSelector((state) => state.user);
  const orderData = useSelector(
    (state) => state.order.orders[state.order.activeOrder]
  );
  const [showErrorModal, setShowErrorModal] = useState(false);
  const disp = useDispatch();
  const [products, setProducts] = useState([]);
  const [magicCheckoutData, setMagicCheckoutData] = useState(null);
  const initialErrorMap = useMemo(() => {
    return { phone: null, address: null, name: null };
  }, []);
  const [fieldsErrorMap, setFieldsErrorMap] = useState(initialErrorMap);
  const [loading, setLoading] = useState(false);
  const [sandbox, setIsSandbox] = useState(false);

  const nav = useNavigate();

  const checkoutUrl = `${env.API_URL}/api/checkout`;

  const myRef = useRef(null);

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
          `${env.API_URL}/api/complete_checkout/${magicCheckoutData["checkout_id"]}/${magicCheckoutData["link_token"]}/${sandbox}`
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
          response = {
            type: "ERROR_RESPONSE",
            message: err.message,
          };
        })
        .finally(() => {
          sendEventToChild(response);
          disp(clear());
          disp(clearUserData());
          setTimeout(() => nav("/"), 500);
        });
    },
    [magicCheckoutData, disp, nav, sandbox]
  );

  const getCheckoutParams = useCallback(() => {
    const data = get_formated_data(
      userData,
      orderData,
      env.MERCHANTS_CHECKOUT_ID
    );

    setLoading(true);

    axios
      .post(checkoutUrl, { ...data, isSandbox: sandbox })
      .then((resp) => {
        if (resp.status === 200) {
          setMagicCheckoutData(resp.data);
          setFieldsErrorMap({ ...initialErrorMap });
        }
      })
      .catch((e) => {
        setFieldsErrorMap({ ...initialErrorMap });
        const errorData = JSON.parse(e.response.data);
        console.log(errorData);
        if (errorData?.billing?.phone_number) {
          setFieldsErrorMap((em) => {
            return { ...em, phone: errorData.billing.phone_number[0] };
          });
        }
        if (errorData?.shipping?.phone_number) {
          setFieldsErrorMap((em) => {
            return {
              ...em,
              phone: errorData.shipping.phone_number[0],
            };
          });
        }
      })
      .finally(() => setLoading(false));
  }, [checkoutUrl, initialErrorMap, orderData, userData, sandbox]);

  const validUserData = useCallback(() => {
    return (
      userData.name.trim() !== "" &&
      userData.phone.trim() !== "" &&
      userData.address.trim() !== ""
    );
  }, [userData]);

  useEffect(() => {
    if (validUserData()) {
      const timer = setTimeout(getCheckoutParams, 300);
      return () => clearTimeout(timer);
    }

    setMagicCheckoutData(null);
  }, [
    checkoutUrl,
    orderData,
    initialErrorMap,
    getCheckoutParams,
    validUserData,
  ]);

  useEffect(() => {
    disp(updateCurrentOrder({ clientData: { ...userData } }));
  }, [userData, disp]);

  useEffect(() => {
    const prodKeys = Object.keys(orderData.products);
    if (prodKeys.length === 0) {
      nav("/");
      return () => {};
    }
    setProducts(prodKeys.map((prodId) => orderData.products[prodId]));
  }, [orderData.products, nav]);

  useEffect(() => {
    const element = myRef.current;
    if (element) {
      element.onSuccess = onSuccess;
      element.onError = onError;
    }
  }, [magicCheckoutData, onSuccess]);

  const fakeMagicBtnClick = () => {
    if (!validUserData()) {
      setShowErrorModal(true);
    }
  };

  return (
    <>
      <Box>
        <AppBar title="Checkout" linkTo={"/"} />
        <Box
          sx={{
            mx: "auto",
            padding: { sm: "0px 50px 0px" },
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginTop: "50px",
          }}
        >
          <BaseModal
            open={showErrorModal}
            close={() => setShowErrorModal(false)}
            title={"Missing data"}
          >
            <Typography level="body-lg">
              Please fill the form before paying by bank
            </Typography>
          </BaseModal>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <Switch
              checked={sandbox}
              onChange={(event) => setIsSandbox(event.target.checked)}
            />
            <Box
              sx={{
                gap: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                level="h4"
                textColor={currentTheme.colors.textPrimary}
                sx={{ marginRight: "auto" }}
              >
                Consumer info
              </Typography>
              <Stack spacing={2} sx={{ padding: "10px" }}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={userData.name}
                    required
                    onChange={(evt) => {
                      disp(
                        setUserData({ ...userData, name: evt.target.value })
                      );
                    }}
                  />
                </FormControl>
                <FormControl error={fieldsErrorMap?.phone !== null}>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    value={userData.phone}
                    type="number"
                    required
                    onChange={(evt) => {
                      disp(
                        setUserData({ ...userData, phone: evt.target.value })
                      );
                    }}
                  />
                  {fieldsErrorMap?.phone !== null && (
                    <FormHelperText>{fieldsErrorMap.phone}</FormHelperText>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel>Address</FormLabel>
                  <Input
                    value={userData.address}
                    required
                    multiline="true"
                    onChange={(evt) => {
                      disp(
                        setUserData({ ...userData, address: evt.target.value })
                      );
                    }}
                  />
                </FormControl>
              </Stack>
            </Box>
            <Box
              sx={{
                gap: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                level="h4"
                textColor={currentTheme.colors.textPrimary}
                sx={{ marginRight: "auto" }}
              >
                Order info
              </Typography>
              <OrderTable products={products} />
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            width: "100%",
          }}
        >
          <Box
            sx={{
              marginLeft: "auto",
              padding: "50px",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography level="h4">Pay with Bank</Typography>
            {!loading && magicCheckoutData && sandbox && (
              <magic-link
                checkoutId={magicCheckoutData.checkout_id}
                linkToken={magicCheckoutData.link_token}
                onSuccess={onSuccess}
                OnError={onError}
                ref={myRef}
                isSandbox
              />
            )}

            {!loading && magicCheckoutData && !sandbox && (
              <magic-link
                checkoutId={magicCheckoutData.checkout_id}
                linkToken={magicCheckoutData.link_token}
                onSuccess={onSuccess}
                OnError={onError}
                ref={myRef}
              />
            )}

            {!loading && !magicCheckoutData && (
              <magic-btn onClick={fakeMagicBtnClick} />
            )}
            {loading && (
              <Box sx={{ mx: "auto", my: "auto" }}>
                <CircularProgress />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}
