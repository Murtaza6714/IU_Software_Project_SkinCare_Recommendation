import React from "react";
import { Box, Grid, Typography, styled } from "@mui/material";
import ServiceCard from "@/components/cards/service/ServiceCard";

const StyledServiceComponent = styled(Box)(({ theme }) => ({
  padding: `100px 150px`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

const ServicesComponent = () => {
  return (
    <StyledServiceComponent>
      <Box mb={2}>
        <Typography
          mb={3}
          gutterBottom
          fontWeight={700}
          variant="h4"
          textAlign="center"
        >
          Services
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item md={3}>
          <ServiceCard
            title="DGFT Consultant"
            imgUrl="https://5.imimg.com/data5/SELLER/Default/2021/5/DR/HY/TG/5259098/dgft-consultancy-services-500x500.jpg"
            content="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups."
            btnLabel="Know More"
          />
        </Grid>
        <Grid item md={3}>
          <ServiceCard
            title="Customs"
            imgUrl="https://www.indiafilings.com/learn/wp-content/uploads/2022/03/The-Customs-Import-of-Goods-at-Concessional-Rate-of-Duty-Amendment-Rules-2022.jpg"
            content="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups."
            btnLabel="Know More"
          />
        </Grid>
        <Grid item md={3}>
          <ServiceCard
            title="Subsidy"
            imgUrl="https://www.financialexpress.com/wp-content/uploads/2019/06/subsidy-660.jpg?w=660"
            content="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups."
            btnLabel="Know More"
          />
        </Grid>
        <Grid item md={3}>
          <ServiceCard
            title="Taxiation"
            imgUrl="https://plus.unsplash.com/premium_photo-1677865215414-f78e263f7c85?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGF4YXRpb258ZW58MHx8MHx8fDA%3D"
            content="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups."
            btnLabel="Know More"
          />
        </Grid>
      </Grid>
    </StyledServiceComponent>
  );
};

export default ServicesComponent;
