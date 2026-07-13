import { useState } from 'react';
import FormRowSelect from '@/components/forms/FormRowSelect';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { AppModal, AppButton } from '@/components/ui';


const NavLinksModalBox = ({ handleExport, handleClose, state }) => {

    const { t } = useTranslation('layout');
    const { user } = useSelector((store) => store.utilizador);
    const [open, setOpen] = useState(state);
    const [selectedUser, setSelectedUser] = useState("Todos");
    const [change, setChange] = useState(false);


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


    const handleChangeUtilizador = ((e) => {
        const { value } = e.target;

        setChange(!change);

        setSelectedUser(value);
    });


    return (
        <AppModal
            open={open}
            onClose={handleClose}
            title={t('exportModal.title')}
            footer={
                <>
                    <AppButton variant="danger" onClick={handleClose}>
                        {t('exportModal.close')}
                    </AppButton>
                    <AppButton variant="success" onClick={handleExportButton}>
                        {t('exportModal.export')}
                    </AppButton>
                </>
            }
        >
            <div id="modal-modal-description">
                <FormRowSelect
                    type="text"
                    className="row mb-3 text-center"
                    classNameLabel='col-md-2 mt-2 text-end'
                    classNameInput='col-md-10'
                    classNameResult='col-md-10 mt-2 text-start'
                    id="piloto"
                    name="Piloto"
                    labelText={t('exportModal.groupLabel')}
                    value={selectedUser}
                    list={[{ nome: "Projetos", value: "Projetos" }]}
                    handleChange={handleChangeUtilizador}
                    multiple={false}
                    todos={user?.user?.tipo}
                />
            </div>
        </AppModal>
    );
};

NavLinksModalBox.propTypes = {
    handleExport: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    state: PropTypes.bool.isRequired,
}


export default NavLinksModalBox;
