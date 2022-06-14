import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Rating from './Rating';

export default function MultiActionAreaCard(prop) {
  return (
    <Card className={prop.className}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={prop.image}
          alt={prop.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {prop.title}
          </Typography>
          <Typography variant="h5" color="text.secondary">
            ${prop.cost}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Rating rating={prop.rating} />
      <CardActions className='card-actions'>
        <Button className='card-button' variant='contained' size="big" color="primary" startIcon={<AddShoppingCartIcon />} style={{'width':'100%'}} onClick={prop.onClick}>
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
}