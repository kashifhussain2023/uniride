import styled from '@emotion/styled';
const CustomFormControl = props => {
  const { height, fontWeight, ...otherProps } = props;
  return <StyledInput {...otherProps} height={height} fontWeight={fontWeight} />;
};
export default CustomFormControl;
const StyledInput = styled.input`
  ${({ theme }) => `
    padding: 14px 8px;
    border-radius: 4px;
    border: 1px solid ${theme.colors.palette.grey};
    width: 100%;
    height: ${props => props.height || 'auto'};
    font-weight: ${props => props.fontWeight || 'light'};
    color: ${theme.colors.palette.darkGrey};
    font-size: 16px;

    &::placeholder {
      color: #b6b6b6;
      opacity: 1; /* Firefox */
    }

    &::-ms-input-placeholder {
      /* Edge 12 -18 */
      color: #b6b6b6;
    }
  `}
`;
