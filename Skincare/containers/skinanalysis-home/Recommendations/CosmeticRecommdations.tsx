import { Box, Container, Grid, Typography, styled } from "@mui/material";
import React, { Fragment } from "react";
const instaGlow = "/images/insta_glow.jpg";
const goldenMask = "/images/goldenmask.jpg";
const faceNeck = "/images/face_neck.jpg";

interface CosmeticRecommdationsProps {
  data: any[];
}

const StyledCosmeticRecommdations = styled(Box)(({ theme }) => ({
  paddingBottom: 75,
  paddingTop: 75,
  "& .MuiTypography-h5": {
    fontWeight: 800,
    textTransform: "uppercase",
    color: theme.palette.grey[600],
  },
  "& .MuiTypography-h3": {
    fontWeight: 800,
  },
  "& span": {
    color: theme.palette.primary.main,
    marginRight: 10,
  },
  "& .salone_card_wrapper": {
    width: "100%",
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.common.white,
    padding: 20,
    borderRadius: 10,
    height: "100%",
    "& .card_image": {
      width: "100%",
      height: 300,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "top center",
      borderRadius: 10,
      marginBottom: 20,
    },
    "& .MuiTypography-body1": {
      color: theme.palette.text.secondary,
    },
  },
}));

const CosmeticRecommdations = ({ data }: CosmeticRecommdationsProps) => {
  console.log(data);  
  return (
    <StyledCosmeticRecommdations>
      <Container maxWidth="lg">
        
      </Container>
    </StyledCosmeticRecommdations>
  );
};

export default CosmeticRecommdations;
