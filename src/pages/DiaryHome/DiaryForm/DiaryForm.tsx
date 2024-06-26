import { Box, TextField, Button, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addDiary } from '../../../redux/diarySlice';

const styles = {
  submitNew: {
    fontFamily: 'Public Sans',
    fontSize: '18px',
    fontWeight: '500',
    lineHeight: '24px',
    color: '#4B465C',
  },
close:{
  width: '24px',
  height: '24px',
  color: '#4B465C',
},

  text: {
    fontFamily: 'Public Sans',
    fontSize: '13px',
    fontWeight: '400',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  dialogActions:{
    display: 'flex',
    gap: '16px',
    justifyContent: 'flex-start',
    ml: '16px',
  },

  submit:{
    textTransform: 'none',
    backgroundColor: '#0092DD',
    width: { xs: '30%', sm: '94px' },
    height: '38px',
    
  },

  cancle:{
    textTransform: 'none',
    width: { xs: '30%', sm: '94px' },
    height: '38px',
    border: 'none',
    backgroundColor: 'rgba(168, 170, 174, 0.16)', 
    color: '#A8AAAE',
  }
};





interface DiaryFormProps {
  onClose: () => void;
  onDiarySubmit: () => void;
}


const DiaryForm: React.FC<DiaryFormProps> = ({onClose, onDiarySubmit}) => {

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const nickname = localStorage.getItem('nickname');

  const dispatch = useDispatch();

  const onsubmit = () => {
    if (title === "" || description === "") {
      alert("Please fill out all fields");
      return;
    }else{
      
      console.log("Title: ", title);
      console.log("Description: ", description);

      if (nickname) {
        interface Diary {
          title: string;
          description: string;
          nickname: string;
        }

        dispatch(addDiary({ title, description, nickname } as Diary));
      } 

      setTitle("");
      setDescription("");
      onClose();
      onDiarySubmit();
    }
  };

  return (
    <Box >

      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography sx={styles.submitNew}>Submit New</Typography>
          <DisabledByDefaultRoundedIcon  onClick={onClose} sx={styles.close}/>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={styles.form}>

          <Box>
          <Typography sx={styles.text}>Title</Typography>
          <TextField placeholder='Title' variant="outlined" fullWidth 
          value={title}
          onChange={(e) => setTitle(e.target.value)}/>
          </Box>

          <Box>
          <Typography sx={styles.text}>Description</Typography>
          <TextField placeholder='Description' variant="outlined" fullWidth multiline rows={10} 
          value={description}
          onChange={(e) => setDescription(e.target.value)}/>
          </Box>

        </Box>
      </DialogContent>

      <DialogActions sx={styles.dialogActions}>
        <Button variant="contained" sx={styles.submit} onClick={onsubmit}>Submit</Button>
        <Button variant="outlined" sx={styles.cancle} onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Box>
  );
};

export default DiaryForm;
