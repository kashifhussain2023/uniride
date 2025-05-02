import styled from '@emotion/styled';
export default function InnerContent({ children }) {
  return <Container>{children}</Container>;
}
const Container = styled.div`
  ${({ theme }) => `
    padding: ${theme.spacing(3)};
    height: 100%;
    overflow: auto;
    max-width: 1776px;
    margin: 0 auto;
    padding: 0px 15px @media (min-width: ${theme.breakpoints.values.md}px) {
      height: calc(100vh - 130px);
    }

    @media (min-width: ${theme.breakpoints.values.lg}px) {
      padding-top: ${theme.spacing(4)};
      padding-bottom: ${theme.spacing(3)};
      padding-left: ${theme.spacing(3)};
      padding-right: ${theme.spacing(3)};
    }

    .MuiGrid-root {
      overflow: hidden;
    }
  `}
`;
