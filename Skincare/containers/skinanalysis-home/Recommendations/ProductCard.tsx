import React, { useState } from "react";
import {
  Card,
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  styled,
  IconButton,
} from "@mui/material";
import { capitalizeWords, shouldForwardProp } from "@/utils/func";
import { Icon } from "@iconify/react";
import Dialog from "@mui/material/Dialog";
import posthog from "posthog-js";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

interface ProductCardProps {
  ribbenColor?: string;
  productBenefits: string;
  name: string;
  productUse: string;
  retailPrice: string;
  matches: any[];
  images: any[];
  enabledMask?: boolean;
  shopifyUrl: string;
  minWidth?: number;
  category?: string;
}

const StyledProductCard = styled(Card, {
  shouldForwardProp: (prop) =>
    shouldForwardProp<{ enabledMask?: boolean; minWidth?: number }>(
      ["enabledMask", "minWidth"],
      prop
    ),
})<{ enabledMask?: boolean; minWidth?: number }>(
  ({ theme, enabledMask, minWidth }) => ({
    height: "100%",

    ...(minWidth && {
      minWidth: minWidth,
      height: "auto",
      padding: 20,
      marginRight: 15,
    }),
    width: "100%",
    padding: 40,
    [theme.breakpoints.only("xs")]: {
      padding: 10,
    },
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
    // justifyContent: "center",
    position: "relative",
    "& .cta-dialog-box": {
      width: 370,
      height: 300,
    },
    "& .MuiTypography-subtitle1": {
      fontWeight: 800,
      fontSize: 18,
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: "2",
      WebkitBoxOrient: "vertical",
      ...(enabledMask && {
        filter: "blur(1rem)",
      }),
      [theme.breakpoints.only("xs")]: {
        fontSize: 16,
        lineHeight: 1,
        marginBottom: 10,
      },
    },
    "& .MuiTypography-body1": {
      fontWeight: 500,
      fontSize: 16,
      color: theme.palette.text.secondary,
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: "2",
      WebkitBoxOrient: "vertical",
      ...(enabledMask && {
        filter: "blur(1rem)",
      }),
      [theme.breakpoints.only("xs")]: {
        fontSize: 14,
        lineHeight: 1,
        marginBottom: 10,
      },
    },
    "& .product_image": {
      position: "relative",
      width: "100%",
      padding: 10,
      height: 200,
      marginBottom: 20,
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
      backgroundPosition: "center",
      ...(enabledMask && {
        filter: "blur(1rem)",
      }),
      [theme.breakpoints.only("xs")]: {
        height: 150,
      },
    },
    "& .product-masking": {
      position: "absolute",
      width: "100%",
      height: "100%",
      paddingLeft: 30,
      paddingRight: 30,
      top: 0,
      left: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    "& .chip": {
      ...(enabledMask && {
        filter: `blur(1rem)`,
      }),
    },
    "& .MuiButton-root": {
      "& svg": {
        color: theme.palette.common.white,
      },
    },
  })
);

const StyledCtaDialogModel = styled(Box)(({ theme }) => ({
  width: 370,
  height: 250,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  "& .close-icon-wrapper": {
    position: "absolute",
    top: 0,
    right: 0,
  },
}));

const ProductCard = ({
  name,
  productBenefits,
  productUse,
  matches,
  images,
  retailPrice,
  enabledMask,
  shopifyUrl,
  minWidth,
  category,
}: ProductCardProps) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const [openCTA, setOpenCTA] = useState<boolean>(false);
  const handleAddToCart = () => {
    window.open(shopifyUrl);
  };

  const handlePostHogEvent = (eventName: string) => {
    posthog.capture(session?.user.firstName+"_"+eventName, {
      buttonName: "CallToUs",
      location: pathName,
      userId: session?.user?.id,
      userName: session?.user.firstName,
      gender: session?.user.gender,
      phone: session?.user?.mobileNumber,
      userImage: session?.user?.selfyImagePath,
      productName: name,
      productPrice: retailPrice,
      category,
    });
  };

  return (
    <StyledProductCard enabledMask={enabledMask} minWidth={minWidth}>
      <Box
        component="div"
        className="product_image"
        sx={{
          backgroundImage: `url(${images?.[0]?.url})`,
        }}
      ></Box>
      <Box flexGrow={1}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box mb={1}>
              <Chip
                variant="outlined"
                className="chip"
                style={{ borderRadius: 5 }}
                color="primary"
                size="small"
                label={matches?.[0]?.name?.replace("_", " ")}
              />
            </Box>
            <Typography color="primary" variant="subtitle1">
              {capitalizeWords(name)}
            </Typography>
            <Typography variant="body1">
              {productUse
                .split(" ")
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ")}
            </Typography>
            {productBenefits && (
              <Box mt={1}>
                <Typography variant="subtitle1">Benefits</Typography>
                <Typography variant="body1">
                  {productBenefits
                    .split(" ")
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(" ")}
                </Typography>
              </Box>
            )}
            <Box mt={1}>
              <Typography color="primary" variant="subtitle1">
                INR.{retailPrice}/-
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      {!enabledMask && !shopifyUrl && (
        <Button
          variant="contained"
          color="secondary"
          startIcon={<Icon icon="line-md:phone-call-loop" />}
          onClick={() => {
            setOpenCTA(true);
          }}
          size="small"
          sx={{
            marginTop: 2,
            padding: "6px 12px",
            typography: "body1",
            whiteSpace: "nowrap",
          }}
        >
          Call To Order
        </Button>
      )}
      {openCTA && (
        <Dialog open={openCTA}>
          <StyledCtaDialogModel>
            <Box>
              <Typography color="primary" variant="h4" fontWeight={800}>
                992674784
              </Typography>
            </Box>
            <Box mt={3}>
              <Button href="tel:0731-2531933" color="secondary" size="medium">
                Call Now
              </Button>
            </Box>
            <Box component="div" className="close-icon-wrapper">
              <IconButton
                onClick={() => {
                  setOpenCTA(false);
                }}
              >
                <Icon icon="mdi:close" />
              </IconButton>
            </Box>
          </StyledCtaDialogModel>
        </Dialog>
      )}

      {/* {enabledMask && (
        <Box component="div" className="product-masking">
          <Grid container>
            <Grid item xs={12}>
              <Typography textAlign="center" variant="subtitle2">
                To View more products{" "}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<Icon icon="line-md:phone-call-loop" />}
                onClick={() => {
                  handlePostHogEvent("click_call_to_us_btn");
                  setOpenCTA(true);
                }}
                size="small"
                sx={{
                  marginTop: 2,
                  padding: "6px 12px",
                  typography: "body1",
                  whiteSpace: "nowrap",
                }}
              >
                Call To Us
              </Button>
            </Grid>
          </Grid>
        </Box>
      )} */}
    </StyledProductCard>
  );
};

export default ProductCard;
