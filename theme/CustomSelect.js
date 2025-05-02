import styled from '@emotion/styled';
const StyledSelect = styled.select`
  ${({ theme }) => `
  padding: 14px 8px;
  border-radius: 4px;
  border: 1px solid ${theme.colors.palette.grey}; 
  width:100%;
  height: ${props => props.height || 'auto'};
  font-weight: ${props => props.fontWeight || 'light'};
  color:#b6b6b6; font-size:16px; background-color:${theme.colors.palette.white};

  &::placeholder {
    color: #b6b6b6;
    opacity: 1; /* Firefox */
  }
  
  &::-ms-input-placeholder { /* Edge 12 -18 */
    color: #b6b6b6;
  }
 

  `}
`;
const CustomSelect = props => {
  const { height, fontWeight, ...otherProps } = props;
  return <StyledSelect {...otherProps} height={height} fontWeight={fontWeight} />;
};
export default CustomSelect;
