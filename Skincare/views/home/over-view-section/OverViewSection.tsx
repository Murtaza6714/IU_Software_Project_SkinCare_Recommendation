import React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

const StyledOverSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: `100px 150px`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

const OverViewSection = () => {
  return (
    <StyledOverSection>
      <Typography
        mb={3}
        gutterBottom
        fontWeight={700}
        variant="h4"
        textAlign="center"
      >
        Elite Consultant Overview
      </Typography>
      <Typography textAlign="justify">
        Elite Consultants is a professional consulting firm that provides
        services with respect to Indirect Taxation regarding DGFT Services,
        Customs Services and GST, as well as Industrial Subsidies from various
        Government Departments. We also assist foreign investors and global or
        international companies whose business interests lie in India. We are
        ISO 9001:2015 certified organisation with stringent processes to deliver
        best-in-the-industry services. Our core competency lies in our in-depth
        knowledge of the Regulatory Environment, Government Policies &
        Procedures and the role of different Government Agencies. Our notable
        experience in this sector helps us to be a business-oriented firm while,
        our expertise in the subject matter related to Foreign Trade Policy,
        Industrial Subsidies and other related issues across different sectors &
        segments, has enabled us to provide high-quality services and innovative
        solution to our customers.
      </Typography>
    </StyledOverSection>
  );
};

export default OverViewSection;
