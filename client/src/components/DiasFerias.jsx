import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import Wrapper from '../assets/wrappers/Dias';
import { useDispatch } from 'react-redux';
import { AiFillDelete } from 'react-icons/ai';
import { getDiaID } from '../features/dias/diasSlice';
import PropTypes from 'prop-types';


const DiaFerias = ({ _id, Data, NumeroDias, _id_Group, Dias, DiasCount, Utilizador, associated, accepted, tipoUser, deleteDay, deleteDayGroup, buttonConfirmed, diaSelected, tipo ,color2, color3 ,color4, color5 , color6}) => {
    const dispatch = useDispatch();
    const [diaAssociated, setDiaAssociated] = useState(null);
    const [listDias, setListDias] = useState(null);

    const fetchAssociatedDay = useCallback(async () => {
        if (associated) {
            try {
                const res = await dispatch(getDiaID({ associated }));
                const data = res?.payload?.dia?.Data;
                setDiaAssociated(data);
            } catch (error) {
                console.error("Error fetching associated day", error);
            }
        }
    }, [associated, dispatch]);



    const dataFormatted = useMemo(() => {
        return Data ? new Date(Data) : '';
    }, [Data]); // Depend on Data so it updates when Data changes


    const dataDay = useMemo(() => {
        if (dataFormatted) {
            const dayOfWeek = dataFormatted?.getDay();

            switch (dayOfWeek) {
                case 1:
                    return "Segunda-Feira";
                case 2:
                    return "Terça-Feira";
                case 3:
                    return "Quarta-Feira";
                case 4:
                    return "Quinta-Feira";
                case 5:
                    return "Sexta-Feira";
                case 6:
                    return "Sábado";
                case 0:
                    return "Domingo";
                default:
                    return "Erro";
            }
        }

        return;
    }, [dataFormatted]); // Depend on currentDate so it recalculates when the date changes



    useEffect(() => {
        if (Dias) {
            const listaDias = Dias.map(({ Data }) => { 
                const dataDia = new Date(Data);
                const key = `${dataDia.getDate()}|${dataDia.getMonth()}|${dataDia.getFullYear()}`;

                // Check if the date exists in DiasCount and if the count is greater than 1
                const count = DiasCount[key] || 0;

                // Return the date along with a color flag if count is greater than 1
                return { date: dataDia.getDate(), isHighlighted: count };
            });
            // Sort the list in ascending order
            const sortedDias = listaDias.sort((a, b) => a.date - b.date);
 
            const getColor = (count) => {
                if (count > 5) return color6;
                if (count === 5) return color5;
                if (count === 4) return color4; 
                if (count === 3) return color3;
                if (count === 2) return color2;
                return 'black';
            };

            
            // Map through sortedDias and apply a different color if isHighlighted is true
            const diasString = sortedDias.map(({ date, isHighlighted }) => {
                if (isHighlighted) {
                    const color = getColor(isHighlighted); 
                    return `<span style="color: ${color};">${date}</span>`;
                }
                return `${date}`;
            }).join(' | ');
            // Set the formatted string to state
            setListDias(diasString);
        }
        // fetchProjetoList();
    }, [Dias]);

    const deleteDiaConfirm = useCallback(async (id, data) => {
        try {
            await deleteDay(id, data);
        } catch (error) {
            console.error("Error deleting day", error);
        }
    }, [deleteDay]);


    const deleteDiaGroupConfirm = useCallback(async (id, data, _id_Group) => {
        try {
            await deleteDayGroup(id, data, _id_Group);
        } catch (error) {
            console.error("Error deleting férias", error);
        }
    }, [deleteDayGroup]);

    if (tipo === false) {
        if (NumeroDias > 0) {
            return (
                <Wrapper>
                    <div key={_id}>
                        <div className="dias">
                            <div className="list-group-item" style={{ margin: "auto" }}>

                                <div className="row text-center" style={{ margin: "auto" }}>
                                    <div className="col-md-3 themed-grid-col" style={{ margin: "auto" }}>
                                        <h4 style={{ margin: "auto" }}>{Utilizador.nome}</h4>
                                    </div>
                                    <div className="col-md-9 mb-2 themed-grid-col" style={{ margin: "auto" }}>
                                        <div className="row text-center">
                                            {diaSelected === 0 ? (
                                                <>
                                                    <div className="col-md-6 themed-grid-col" style={{ margin: "auto" }}>
                                                        <h4 style={{ margin: "auto" }}>{NumeroDias}</h4>
                                                    </div>
                                                    <div className="col-md-6 text-center" style={{ margin: "auto" }}>
                                                        <h3 style={{ margin: "auto" }} dangerouslySetInnerHTML={{ __html: listDias }} />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="col-md-6" style={{ margin: "auto" }}>
                                              
                                                        <h3 style={{ margin: "auto" }}>{dataDay}</h3>
                                                    </div>
                                                    <div className="col-md-6 themed-grid-col" style={{ margin: "auto" }}>
                                                        <h4 style={{ margin: "auto" }}>{NumeroDias}</h4>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <hr />
                                </div>
                            </div>
                        </div>
                    </div>

                </Wrapper>

            )

        }
    } else {

        return (
            <Wrapper>
                <div key={`${_id}-${Utilizador}`}>
                    <div className='dias'>
                        <div className="list-group-item">
                            <div className="row text-center">
                                <div className="col-md-3" style={{ margin: "auto" }}>
                                    <h3 style={{ margin: "auto" }}>{dataFormatted ? dataFormatted.toLocaleDateString('en-CA') : ''}</h3>
                                </div>

                                <div className="col-md-3" style={{ margin: "auto" }}>
                                    <h3 style={{ margin: "auto" }}>{dataDay}</h3>
                                </div>
                                {(tipoUser === 7 || (accepted !== 2 && accepted !== 3 && accepted !== 5 && accepted !== 7)) && (
                                    <>
                                        <div className='col-md-3 text-end' style={{ margin: "auto" }}>
                                            <button type='submit' onClick={() => deleteDiaConfirm(_id, Data)} disabled={buttonConfirmed} className="btn" style={{ margin: "auto" }}>
                                                <AiFillDelete />
                                            </button>
                                        </div>

                                        {(accepted !== 2 && accepted !== 3 && accepted !== 5 && accepted !== 7 && _id_Group && _id_Group !== 0) ?
                                            <div className='col-md-6' style={{ margin: "auto" }}>
                                                {buttonConfirmed ? (
                                                    <div className="spinner-border text-danger" role="status">
                                                        <span style={{ margin: "auto" }} className="sr-only"></span>
                                                    </div>
                                                ) : (
                                                    <button style={{ margin: "auto" }} type='submit' onClick={() => deleteDiaGroupConfirm(_id, Data, _id_Group)} disabled={buttonConfirmed} className="btn btn-danger">
                                                        Apagar Pedido {_id_Group}
                                                    </button>
                                                )}
                                            </div>
                                            : <div className='col-md-6'> </div>
                                        }
                                    </>
                                )}
                            </div>
                            <div className="row text-center">


                                <hr />
                            </div>
                        </div>
                    </div>
                </div>
            </Wrapper>
        );
    }
};

DiaFerias.propTypes = {
    _id: PropTypes.string,
    Data: PropTypes.instanceOf(Date),
    NumeroDias: PropTypes.number.isRequired,
    Utilizador: PropTypes.object.isRequired,
    associated: PropTypes.string,
    accepted: PropTypes.number,
    tipoUser: PropTypes.number,
    deleteDay: PropTypes.func,
    deleteDayGroup: PropTypes.func,
    buttonConfirmed: PropTypes.bool,
    diaSelected: PropTypes.number.isRequired, 
    tipo: PropTypes.bool.isRequired,
    color2: PropTypes.string.isRequired,
    color3: PropTypes.string.isRequired,
    color4: PropTypes.string.isRequired,
    color5: PropTypes.string.isRequired,
    color6: PropTypes.string.isRequired,
};

export default memo(DiaFerias);
