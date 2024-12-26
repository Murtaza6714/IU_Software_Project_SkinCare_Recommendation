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

interface BundleCardProps {
  ribbenColor?: string;
  name: string;
  skinTypes: any[];
  price: string | number;
  images: any[];
  enabledMask?: boolean;
  shopifyUrl: string;
  minWidth?: number;
}

const StyledBundleCard = styled(Card, {
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
    [theme.breakpoints.only('xs')]:{
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
        fontSize: 14,
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

const BundleCard = ({
  name,
  skinTypes,
  images,
  price,
  enabledMask,
  shopifyUrl,
  minWidth,
}: BundleCardProps) => {
  const [openCTA, setOpenCTA] = useState<boolean>(false);
  const handleAddToCart = () => {
    window.open(shopifyUrl);
  };

  return (
    <StyledBundleCard enabledMask={enabledMask} minWidth={minWidth}>
      
    </StyledBundleCard>
  );
};

export default BundleCard;
