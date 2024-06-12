import React, { useState, useCallback } from 'react';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormRow from './FormRow';
import { toast } from 'react-toastify';


const AddHorasDomingo = ({ handleDateChoosen,handleClose, state, checkDate,dataReceived, feriadosPortugal}) => {

    const verificaData = (dataChoosen ,type)=>{
        const dayOfWeek = dataChoosen.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        if(feriadosPortugal(dataChoosen)){
            if(type === "0"){
                toast.error('Data escolhida não permitida! Feriado!');
            }
            return false;
        }else if(isWeekend){
            if(type === "0"){
                toast.error("Data escolhida não permitida! Fim de Semana")
            }
            return false;
      } else if(checkDate(dataChoosen)){
            if(type === "0"){
                toast.error("Data escolhida já possui horas!")
            }
            return false;
      } else{
        return true;
      }
    
    }

    
    const incrementDateByOneDay = (date) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 1);
        while(!verificaData(newDate, "1")){
            newDate.setDate(newDate.getDate() + 1);
        }
        return newDate;
    };

    const [data, setData] = useState(incrementDateByOneDay(dataReceived));
    const [open, setOpen] = useState(state);



    const handleConfirmButton = () => {
        handleDateChoosen(data)
    };



    const style = {
        position: 'absolute',
        zIndex: 9998,
        left: '0%',
        width: '100%',
        height: '100%',
        textAlign: "center",
        alignItems: 'center',  
        justifyContent: 'center',
        bottom: '0',
        display:'block',
    };

    const styleBox = {
        position: 'relative',
        zIndex: 9998,
        top: '30rem',
        height: '50%',
        left: '0%',
        transform: 'translateY(-13rem)', 
        width: '100%',
        backgroundColor: "#FFFFFF",
        padding: 10,
        margin:0,
        textAlign: "center",
    };

const verificaDia = useCallback((e) => {
    const { value } = e.target; 

    const newDateR = new Date(dataReceived);
    const DataChoosen = new Date(value);

    const itemDay = DataChoosen.getDate();
    const itemMonth = DataChoosen.getMonth();
    const itemYear = DataChoosen.getFullYear();

    const currentDay = newDateR.getDate();
    const currentMonth = newDateR.getMonth();
    const currentYear = newDateR.getFullYear();

    if (
        currentYear < itemYear ||
        (currentYear === itemYear  && currentMonth  < itemMonth) || (currentYear === itemYear && currentMonth === itemMonth  && currentDay < itemDay)
      ) {

        if(verificaData(DataChoosen ,"0")){
            setData(value)
        }

        } else{
            toast.error("Data escolhida não permitida! \n Por favor escolha um dia posterior ao Inserido!")
        }
    })


    return (
        <div key ="1">
            <Modal sx={style} open={open} aria-describedby="modal-modal-description">
                <Box sx={styleBox}>
                    <Typography className="mb-5" id="modal-modal-title" variant="h4" component="h2">
                        Escolha um dia para Compensar o Domingo
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>

                    <FormRow
                        type="date"
                        className="dataAddHoras form__field__date"
                        classNameLabel="form-field-label"
                        id="Dia Retirar"
                        name="Compensar no dia: "
                        placeholder="Dia retirar Horas"
                        value={new Date(data).toLocaleDateString('en-CA')}
                        handleChange={verificaDia}
                    />



                    </Typography>
                    <div className='row col-md-12'>
                    <div className='col-md-6 text-center' >
                    <button  type="button" class="btn btn-outline-success"  variant="contained" onClick={handleConfirmButton} sx={{ mt: 2 }}>
                        Confirmar
                    </button>
                    </div>
                    <div className='col-md-6 text-center'>
 
                    <button  type="button" class="btn btn-outline-danger" variant="contained" onClick={handleClose} sx={{ mt: 2 }}>
                        Fechar
                    </button>
                    </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default AddHorasDomingo;
