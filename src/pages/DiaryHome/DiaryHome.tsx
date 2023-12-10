import React from 'react'
import Background from '../../components/Background/Background';
import {  Box, Button, TextField, Typography,  Dialog} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Header from '../../components/Header/Header';
import DiaryForm from './DiaryForm/DiaryForm';

const styles = {
  home:{ fontFamily:"public sans",
    color:"4B465C",
    fontWeight: "700", 
    fontSize: "36px", 
    lineHeight: "24px", 
    position:"absolute", 
    left: '50px', 
    top:'150px'
  },

  box:{
    display:"flex", 
    justifyContent:"spaceBetween",
    height: '48px', 
    padding:'0'
  },

  textfield:{
    width: { xs: '40%', sm: '50%' },
    maxWidth: '50%',
    '& .MuiInputBase-root': {
      height: '48px', 
    },
    position: 'absolute',
    left: '50px',
    top:'200px',
  },

  submibNew:{
    backgroundColor: '#0092DD',
    width: { xs: '30%', sm: '154px' },
    height: '48px',
    position: 'absolute',
    right: '50px',
    top:'200px',

  }
}



const DiaryHome = () => {

  const nickname = localStorage.getItem('nickname'); // get nickname from local storage

  const[open, setOpen] = React.useState(false); // set open state for dialog

  const handleSubmitNew = () => {
    setOpen(true);
  }

  const handleColse = () => {
    setOpen(false);
  }

  return (
    <div>
      <Background>
        <Header userName={nickname} />
        <Box>
          <Typography
            variant="subtitle1"
            sx={styles.home}
          >
            Home
          </Typography>
        </Box>

        <Box sx={styles.box}>
          <TextField placeholder = "Search" 
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={styles.textfield} 
          />
          <Button variant="contained" 
            onClick={handleSubmitNew}
            sx={styles.submibNew}>
            Submit New
          </Button>
        </Box>
        
        <Dialog open={open} onClose={handleColse}>
            <DiaryForm />
        </Dialog>

      </Background>
    </div>
  )
}

export default DiaryHome;