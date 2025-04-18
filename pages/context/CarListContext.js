import { createContext, useContext, useState } from 'react';

const CarContext = createContext();

const CarProvider = ({ children }) => {
  const [carsList, setCarsList] = useState([]);

  return (
    <CarContext.Provider value={{ carsList, setCarsList }}>
      {children}
    </CarContext.Provider>
  );
};

 export const useCarContext = () => {
  return useContext(CarContext);
};
export default CarProvider;