import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { numberFormat } from '../utils/numberFormat.ts';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { ExpenseInterface } from '../types/types.ts';

export const ExpenseItem = ({ item }: { item: ExpenseInterface }) => {
   const navigate = useNavigate();

   return (
      <ListItem key={item._id}>
         <ListItemAvatar>
            <Avatar>
               {item.type === 'instagram_ad' ? (
                  <InstagramIcon />
               ) : item.type === 'facebook_ad' ? (
                  <FacebookIcon />
               ) : (
                  <AttachMoneyIcon />
               )}
            </Avatar>
         </ListItemAvatar>
         <ListItemText
            primary={item.name}
            secondary={'- ' + numberFormat(item.price, item.currency)}
         />
         <IconButton
            edge='end'
            aria-label='edit'
            onClick={() => navigate(`/dashboard/expense-form?id=${item._id}`)}
         >
            <EditIcon />
         </IconButton>
      </ListItem>
   );
};
