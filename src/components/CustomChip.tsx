import { colorFromConstants } from '../utils/colorFromConstants.ts';
import { Chip } from '@mui/material';

export const CustomChip = ({ color }: { color: string }) => {
   return (
      <Chip
         label={color}
         color={'primary'}
         style={{
            backgroundColor: colorFromConstants(color).bgColor,
            color: colorFromConstants(color).textColor,
         }}
      />
   );
};
