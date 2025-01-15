import { AlertColor } from '@mui/material/Alert';

export type GenericDataType = {
  id: number;
  name: string;
  length: number; // in cm
  width: number; // in cm
  height: number; // in cm
  volume: number;
};

export type Product = GenericDataType & {
  weight: number; // in kg
};

export type Box = GenericDataType & {
  weight_limit: number;
};

export type AlertType = {
  severity: AlertColor;
  message: string;
};
