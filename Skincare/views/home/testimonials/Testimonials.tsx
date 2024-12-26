import TestimonialSliderComponent from "@/components/sliders/testimonials/TestimonialsSlider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import React from "react";

const StyledTestimonialsComponent = styled(Box)(({ theme }) => ({
  padding: `100px 150px`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

const TestimonialsComponent = () => {
  return (
    <StyledTestimonialsComponent>
      <Box mb={2}>
        <Typography
          mb={4}
          gutterBottom
          fontWeight={700}
          variant="h4"
          textAlign="center"
        >
          What our clients Says?
        </Typography>
      </Box>
      <TestimonialSliderComponent />
    </StyledTestimonialsComponent>
  );
};

export default TestimonialsComponent;
