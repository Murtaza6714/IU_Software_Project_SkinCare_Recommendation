import ConsultantCard from "@/components/cards/consultant/Consultant";
import { APP_COLORS } from "@/theme/colors/colors";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import React from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { RiTeamLine } from "react-icons/ri";
import { FaLocationDot } from "react-icons/fa6";
import { GrCertificate } from "react-icons/gr";
import { MdMiscellaneousServices } from "react-icons/md";

const StyledWhyEliteComponent = styled(Box)(({ theme }) => ({
  padding: `100px 150px`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

const WhyElite = () => {
  return (
    <StyledWhyEliteComponent>
      <Box mb={2}>
        <Typography
          mb={3}
          gutterBottom
          fontWeight={700}
          variant="h4"
          textAlign="center"
        >
          Why Elite Consultants?
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item md={4}>
          <ConsultantCard
            icon={
              <IoDocumentTextOutline
                size={120}
                color={APP_COLORS.PRIMARY_COLOR}
              />
            }
            content="In-depth knowledge of the Regulatory Environment, Government Policies & Procedures and the role of different Government Agencies."
          />
        </Grid>
        <Grid item md={4}>
          <ConsultantCard
            backgroundColor={APP_COLORS.PRIMARY_COLOR}
            icon={<RiVerifiedBadgeFill size={120} color={APP_COLORS.WHITE} />}
            content="20+ years of experience in the subject matter related to Foreign Trade Policy, Indirect Taxation, Industrial Subsidies and other related issues across different sectors & segments. "
          />
        </Grid>
        <Grid item md={4}>
          <ConsultantCard
            icon={<RiTeamLine size={120} color={APP_COLORS.PRIMARY_COLOR} />}
            content="Team of qualified and experienced professionals with proven track record of having served clients across various MNCs, Private Sector Companies and Indian Corporates"
          />
        </Grid>
        <Grid item md={4}>
          <ConsultantCard
            backgroundColor={APP_COLORS.PRIMARY_COLOR}
            icon={<FaLocationDot size={120} color={APP_COLORS.WHITE} />}
            content="Presence in major cities like Hyderabad, Mumbai, New Delhi, Chennai, Kolkata, Bangalore, Pune, Nagpur, Visakhapatnam"
          />
        </Grid>
        <Grid item md={4}>
          <ConsultantCard
            icon={<GrCertificate size={120} color={APP_COLORS.PRIMARY_COLOR} />}
            content="An ISO 9001:2015 certified organisation with stringent process to deliver best-in-industry services"
          />
        </Grid>
        <Grid item md={4}>
          <ConsultantCard
            backgroundColor={APP_COLORS.PRIMARY_COLOR}
            icon={
              <MdMiscellaneousServices
                size={120}
                color={APP_COLORS.WHITE}
              />
            }
            content="Service supported by ERP system enables us to provide quick and efficient services."
          />
        </Grid>
      </Grid>
    </StyledWhyEliteComponent>
  );
};

export default WhyElite;
