import Delete from '@/components/common/model/Delete';
import styled from '@emotion/styled';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Typography } from '@mui/material';
import Radio from '@mui/material/Radio';
import { useState } from 'react';
import SafeImage from './SafeImage';

export default function CardsList({ cardList, onDefaultCardChange, onDeleteCard }) {
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const [cardId, setCardId] = useState(null);
  const [defaultValue, setDefaultValue] = useState(null);
  const handleChange = (event, index) => {
    setDefaultValue(index);
    onDefaultCardChange(event.target.value);
  };
  const handleDelete = event => {
    setCardId(event);
    setOpenDeleteModel(true);
  };
  const cardCardDelete = () => {
    setDefaultValue(null);
    onDeleteCard(cardId);
  };
  const handleCloseDeleteModel = () => {
    setOpenDeleteModel(false);
  };
  return (
    <>
      {cardList?.length !== 0 ? (
        cardList?.map((list, index) => (
          <CardList key={index}>
            <Cards>
              <Radio
                checked={defaultValue !== null ? defaultValue === index : index === 0}
                onChange={event => handleChange(event, index)}
                value={list.payment_id || ''}
                color="success"
                name="radio-buttons"
                inputProps={{
                  'aria-label': 'A',
                }}
              />
              <ImageContainer>
                <SafeImage
                  src={`/${list.card_type?.toLowerCase() || 'default'}.jpg`}
                  alt={list.card_type}
                  width={70}
                  height={38}
                  priority
                />
              </ImageContainer>
            </Cards>

            <CardsInfo>
              <Typography variant="h6">{list.card_type}</Typography>
              <Typography variant="h4">{list.card_no}</Typography>
            </CardsInfo>

            <CardAction>
              <IconButton>
                <DeleteIcon
                  color="error"
                  fontSize="small"
                  onClick={() => handleDelete(list.payment_id)}
                />
              </IconButton>
              <Delete
                open={openDeleteModel}
                handleClose={handleCloseDeleteModel}
                handleChangeOnDelete={cardCardDelete}
                cardvalue={cardId}
              />
            </CardAction>
          </CardList>
        ))
      ) : (
        <NoList>
          <Typography variant="h3" align="center">
            No records found
          </Typography>
        </NoList>
      )}
    </>
  );
}
const CardList = styled.div`
  ${({ theme }) => `
    background-color: ${theme.colors.palette.white};
    flex-wrap: wrap;
    box-shadow: 0px 0px 15px -1px rgba(0, 0, 0, 0.1);
    padding: 10px;
    display: flex;
    border-radius: 6px;
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 30px;

    @media (min-width: ${theme.breakpoints.values.sm}px) {
      flex-wrap: nowrap;
    }
    .MuiMenuButton-root {
      background-color: transparent;
      border: 0px;
    }
    .MuiButtonBase-root {
      padding: 0px;
      min-width: inherit;
    }
    .MuiRadio-root {
      margin-right: 10px;
    }
    .MuiTouchRipple-root {
      display: none;
    }
  `}
`;
const Cards = styled.div`
  ${({ theme }) => `
    display: flex;
    align-items: center;
    width: 84px;
    flex: 0 0 84px;
    margin-right: 10px;

    @media (min-width: ${theme.breakpoints.values.sm}px) {
      width: 97px;
      flex: 0 0 97px;
      margin-right: 20px;
    }
  `}
`;
const CardsInfo = styled.div`
  ${({ theme }) => `   
    h2 {
      font-size: 18px;
      @media (min-width: ${theme.breakpoints.values.md}px) {
        font-size: 24px;
      }
    }
  `}
`;
const CardAction = styled.div`
  ${({ theme }) => `
    margin-left: auto;
    .MuiButtonBase-root {
      padding: 0px;
      min-width: inherit;
      position: absolute;
      right: 0px;
      top: 15%;
      @media (min-width: ${theme.breakpoints.values.sm}px) {
        position: inherit;
      }
    }
  `}
`;
const NoList = styled.div`
  text-align: center;
`;
const ImageContainer = styled.div`
  ${({ theme }) => `
    width: 45px;
    height: 28px;
    position: relative;

    @media (min-width: ${theme.breakpoints.values.sm}px) {
      width: 70px;
      height: 38px;
    }
  `}
`;
