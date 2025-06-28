import { Stack, styled } from "@mui/material";

const Section = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.surfaceContainerLowest.main,
  padding: theme.spacing(2),
  borderRadius: 28,
}));

export default Section;
