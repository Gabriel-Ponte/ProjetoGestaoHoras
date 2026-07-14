import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import FormRow from '@/components/forms/FormRow';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { AppModal, AppButton } from '@/components/ui';

const AddHorasDomingo = ({ handleDateChoosen, handleClose, state, checkDate, dataReceived, feriadosPortugal }) => {
    const { t } = useTranslation('horas');

    const verificaData = (dataChoosen, type) => {
        const dayOfWeek = dataChoosen.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        if (feriadosPortugal(dataChoosen)) {
            if (type === "0") {
                toast.error(t('toast.dateNotAllowedHoliday'));
            }
            return false;
        } else if (isWeekend) {
            if (type === "0") {
                toast.error(t('toast.dateNotAllowedWeekend'))
            }
            return false;
        } else if (checkDate(dataChoosen)) {
            if (type === "0") {
                toast.error(t('toast.dateAlreadyHasHours'))
            }
            return false;
        } else {
            return true;
        }

    }


    const incrementDateByOneDay = (date) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 1);
        while (!verificaData(newDate, "1")) {
            newDate.setDate(newDate.getDate() + 1);
        }
        return newDate;
    };

    const [data, setData] = useState(() => incrementDateByOneDay(dataReceived));
    const [open] = useState(state);



    const handleConfirmButton = () => {
        handleDateChoosen(data)
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
            (currentYear === itemYear && currentMonth < itemMonth) || (currentYear === itemYear && currentMonth === itemMonth && currentDay < itemDay)
        ) {

            if (verificaData(DataChoosen, "0")) {
                setData(value)
            }

        } else {
            toast.error(t('toast.dateMustBeAfter'))
        }

    }, []);


    return (
        <AppModal
            open={open}
            onClose={handleClose}
            title={t('titles.chooseSundayCompensationDay')}
            footer={
                <>
                    <AppButton variant="danger" onClick={handleClose}>
                        {t('actions.close')}
                    </AppButton>
                    <AppButton variant="success" onClick={handleConfirmButton}>
                        {t('actions.confirm')}
                    </AppButton>
                </>
            }
        >
            <div id="modal-modal-description">
                <FormRow
                    type="date"
                    className="dataAddHoras form__field__date"
                    classNameLabel="form-field-label"
                    id="Dia Retirar"
                    name="Compensar no dia: "
                    labelText={t('labels.compensateOnDay')}
                    placeholder="Dia retirar Horas"
                    value={new Date(data).toLocaleDateString('en-CA')}
                    handleChange={verificaDia}
                />
            </div>
        </AppModal>
    );
};

AddHorasDomingo.propTypes = {
    handleDateChoosen: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    state: PropTypes.bool.isRequired,
    checkDate: PropTypes.func.isRequired,
    dataReceived: PropTypes.string.isRequired,
    feriadosPortugal: PropTypes.func.isRequired,

}

export default AddHorasDomingo;
