import { Box, Container, Grid, Typography, styled } from "@mui/material";
import React from "react";
import DietChartCard from "./DietChartCard";
const StyledDietCharWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  paddingTop: 75,
  paddingBottom: 75,
  backgroundColor: theme.palette.common.white,
  "& .MuiTypography-h5": {
    fontWeight: 800,
    textTransform: "uppercase",
    color: theme.palette.grey[600],
  },
  "& .MuiTypography-h6": {
    fontWeight: 800,
    textTransform: "uppercase",
    marginTop: 15,
  },
  "& .MuiTypography-h3": {
    fontWeight: 800,
  },
  "& span": {
    color: theme.palette.primary.main,
    marginRight: 10,
  },
}));

interface DietChartProps {
  data: any;
}


const DietChart = ({ data }: DietChartProps) => {
  console.log(data)
  return (
    <StyledDietCharWrapper>
      <Container maxWidth="lg">
        
      </Container>
    </StyledDietCharWrapper>
  );
};

export default DietChart;
