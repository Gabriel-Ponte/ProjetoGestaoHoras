import { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormRowSelect from './FormRowSelect';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types'; 


const NavLinksModalBox = ({ handleExport,handleClose, state}) => {

    const { user } = useSelector((store) => store.utilizador);
    const [open, setOpen] = useState(state);
    const [selectedUser, setSelectedUser] = useState("Todos");
    const [change, setChange] = useState(false);

    // const openModalBox = () => {
    //     setOpen(true);
    // };


    const handleExportButton = () => {
        setOpen(false);
        let tipo = 0;

        if (selectedUser === "Engenharia de Processos" || selectedUser === "Laboratorio" || selectedUser === "Outro" || selectedUser === "Administradores" || selectedUser === "Todos" || selectedUser === "Projetos") {
    
            if (selectedUser === "Engenharia de Processos") {
                tipo = 5;
            } else if (selectedUser === "Administradores") {
                tipo = 8;
            } else if (selectedUser === "Laboratorio") {
                tipo = 6;
            } else if (selectedUser === "Outro") {
                tipo = 7;
            } else if (selectedUser === "Todos") {
                tipo = 2;
            } else if (selectedUser === "Projetos") {
                tipo = 9;
            }
        }
        handleExport(tipo)
    };

    // const handleCloseButton = () => {
    //     setOpen(false);
    //     handleClose();
    // };


    const handleChangeUtilizador = ((e) => {
        const { value } = e.target;

        setChange(!change);

        setSelectedUser(value);
    });


    const style = {
        position: 'absolute',
        zIndex: 9999,
        left: '20%',
        width: '80%',
        textAlign: "center",
        bottom: '0',
        
    };

const styleBox = {
    position: 'absolute',
    zIndex: 9999,
    top: '13rem',
    height: '100%',
    left: '0%',
    transform: 'translateY(-13rem)', 
    width: '100%',
    backgroundColor: "#FFFFFF",
    padding: 10,
    textAlign: "center",
    display: 'flex', // Use flexbox
    flexDirection: 'column', // Set flex container to column direction
    justifyContent: 'center', // Center vertically

};
    return (
        <div key ="1">
            <Modal sx={style} open={open} onClose={handleClose} aria-describedby="modal-modal-description">
                <Box sx={styleBox}>
                    <Typography className="mb-5" id="modal-modal-title" variant="h4" component="h2">
                        Exportar Horas
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>

                        <FormRowSelect
                            type="text"
                            className="row mb-3 text-center"
                            classNameLabel='col-md-2 mt-2 text-end'
                            classNameInput='col-md-10'
                            classNameResult='col-md-10 mt-2 text-start'
                            id="piloto"
                            name="Piloto"
                            labelText="Grupo:"
                            value={selectedUser}
                            list={[{ nome: "Projetos", value: "Projetos" }]}
                            handleChange={handleChangeUtilizador}
                            multiple={false}
                            todos={user?.user?.tipo}
                        />
                    </Typography>
                    <div className='row col-md-12'>
                    <div className='col-md-6 text-center' >
                    <button  type="button" className="btn btn-outline-success" onClick={handleExportButton}>
                        Exportar
                    </button>
                    </div>
                    <div className='col-md-6 text-center'>
 
                    <button  type="button" className="btn btn-outline-danger" onClick={handleClose}>
                        Fechar
                    </button>
                    </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

NavLinksModalBox.propTypes = {
    handleExport: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    state: PropTypes.bool.isRequired,
  }


export default NavLinksModalBox;
