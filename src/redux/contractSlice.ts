import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { act } from 'react-dom/test-utils';

import { ContractType } from '@/types';

type userState = {
  contracts: ContractType[];
  currentContractId: string;
  modalStatus: boolean;
  socket: any;
};

const initialState: userState = {
  contracts: [] as ContractType[],
  currentContractId: '' as string,
  modalStatus: false as boolean,
  socket: undefined,
};

export const contract = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    reset: () => initialState,
    setMyContracts: (state, action: PayloadAction<ContractType[]>) => {
      state.contracts = action.payload;
    },
    setModalStatus: (state, action: PayloadAction<boolean>) => {
      state.modalStatus = action.payload;
    },
    setCurrentContractID: (state, action: PayloadAction<string>) => {
      state.currentContractId = action.payload;
    },
    setSocket: (state, action: PayloadAction<any>) => {
      state.socket = action.payload;
    },
  },
});

export const {
  reset,
  setMyContracts,
  setModalStatus,
  setCurrentContractID,
  setSocket,
} = contract.actions;
export default contract.reducer;
