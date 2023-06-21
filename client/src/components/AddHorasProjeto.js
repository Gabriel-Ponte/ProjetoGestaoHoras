import { useEffect, useState, useCallback } from 'react';
import Wrapper from '../assets/wrappers/addHorasProjeto';
import { useSelector, useDispatch } from 'react-redux';
import { getAllProjetos, handleChange } from '../features/allProjetos/allProjetosSlice';
import { toast } from 'react-toastify';
import { getTipoTrabalho } from '../features/tipoTrabalho/tipoTrabalhoSlice';
import { createDia, getDia, editDia } from '../features/dias/diasSlice';
import { FormRow } from '../components';

const initialState = {
    _id: '',
    Data: new Date().toISOString().slice(0, 10),
    NumeroHoras: '',
    Utilizador: '',
    tipoDeTrabalhoHoras: [],
};

const ListaProjetos = () => {
    const [values, setValues] = useState(initialState);
    const { projeto, isLoading } = useSelector((store) => store.projeto.projeto);
    const [listaTipoTrabalho, setListaTipoTrabalho] = useState([]);
    let StringListaTrabalho = listaTipoTrabalho.map(item => item.TipoTrabalho).join(",");
    const {
        projetos,
        totalProjetos,
    } = useSelector((store) => store.allProjetos);

    const dispatch = useDispatch();

    const [showProjeto, setShowProjeto] = useState({});
    const [horasT, setHorasT] = useState(0);
    const { user } = useSelector((store) => store.utilizador);
    const [listaDias, setListaDias] = useState([]);
    const [verificaDiaCalled, setVerificaDiaCalled] = useState(false);

    useEffect(() => {
        dispatch(handleChange({ name: 'projetoFinalizado', value: "false" }));
        dispatch(getAllProjetos({ ProjetoFinalizado: false }))
        dispatch(getTipoTrabalho()).then((res) => {
            const tipoTrabalhoArray = Array.isArray(res.payload.tipoTrabalho) ? res.payload.tipoTrabalho : [];
            setListaTipoTrabalho(tipoTrabalhoArray);
        });
    }, [totalProjetos]);

    useEffect(() => {
        dispatch(getDia(values.Data, user.user.id)).then((res) => {
            setListaDias(res.payload.dia);
        });
    }, []);


    const verificaDia = useCallback((e) => {
        const { name, value } = e.target;
        for (let i = 0; i < listaDias.length; i++) {
            const DataRecebida = new Date(listaDias[i].Data).toISOString().slice(0, 10);
            if (value === DataRecebida) {
                const tipoDeTrabalhoHoras = {};
                for (let j = 0; j < listaDias[i].tipoDeTrabalhoHoras.length; j++) {
                    const val = listaDias[i].tipoDeTrabalhoHoras[j].projeto;
                    tipoDeTrabalhoHoras[val] = listaDias[i].tipoDeTrabalhoHoras[j];
                }
                setValues({
                    ...values,
                    [name]: value,
                    _id: listaDias[i]._id,
                    Utilizador: user.user.id,
                    NumeroHoras: listaDias[i].NumeroHoras,
                    tipoDeTrabalhoHoras: tipoDeTrabalhoHoras,
                });
                setHorasT(listaDias[i].NumeroHoras);
                setVerificaDiaCalled(true);
                return;
            }
        }

        setValues({
            ...values,
            [name]: value,
            NumeroHoras: "",
            tipoDeTrabalhoHoras: [],
        });
        setHorasT(0);
        setVerificaDiaCalled(false);
        return;
    }, [listaDias]);


    useEffect(() => {
        verificaDia({ target: { name: 'Data', value: values.Data } });
    }, [listaDias]);



    const handleDia = async (e) => {
        e.preventDefault();
        if (horasT > 8) {
            toast.error('Valor inserido excede as 8 Horas diarias!');
        }
        if (horasT <= 0) {
            toast.error('Valor inserido invalido!');
            return;
        }

        values.Utilizador = user.user.id;

        if (verificaDiaCalled) {
            await dispatch(editDia(values));
        } else {
            await dispatch(createDia(values));
        }
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    if (projeto === null || typeof projeto === 'undefined') {
        return (
            <Wrapper>
                <h2>Sem projeto para Adicionar Horas</h2>
            </Wrapper>
        );
    }

    const handleHorasChange = (projectId, tipoTrabalho, projectName, e) => {
        let newHorasT = horasT;
        let horasNumber = Number(e.target.value);
        let diff = 0;
        if (isNaN(horasNumber) || horasNumber <= 0 || horasNumber === null) {
            horasNumber = 0;
            //return;
        }

        const newTipoDeTrabalhoHoras = { ...values.tipoDeTrabalhoHoras };
        const horasTipoTrabalhoArray = newTipoDeTrabalhoHoras[projectId]?.horas?.split(',') || [];
        const tipoTrabalhoArray = newTipoDeTrabalhoHoras[projectId]?.tipoTrabalho?.split(',') || [];
        let newShowProjeto = { ...showProjeto };

        if (tipoTrabalhoArray.includes(tipoTrabalho)) {
            const index = tipoTrabalhoArray.indexOf(tipoTrabalho);
            const oldValue = Number(horasTipoTrabalhoArray[index]);
            const newValue = horasNumber;

            if (oldValue !== newValue) {
                diff = newValue - oldValue;
                horasTipoTrabalhoArray[index] = newValue;

                newTipoDeTrabalhoHoras[projectId] = {
                    ...newTipoDeTrabalhoHoras[projectId],
                    horas: horasTipoTrabalhoArray.join(','),
                };
                newHorasT = horasT + diff;
            }

        } else {
            newShowProjeto = {
                ...newShowProjeto,
                [projectId + tipoTrabalho]: horasNumber
            };
            tipoTrabalhoArray.push(tipoTrabalho);
            horasTipoTrabalhoArray.push(horasNumber);
            newTipoDeTrabalhoHoras[projectId] = {
                ...newTipoDeTrabalhoHoras[projectId],
                tipoTrabalho: tipoTrabalhoArray.join(','),
                horas: horasTipoTrabalhoArray.join(',')
            };
            newHorasT = horasT + horasNumber;
        }

        if (newHorasT > 24) {
            toast.error('Valor inserido excede as 24 Horas!');
            setValues({ ...values, [e.target.id]: 0 });
            //setHorasT(horasT - (showProjeto[projectId + tipoTrabalho] || 0));
            return;
        }

        setValues({
            ...values,
            [e.target.id]: horasNumber,
            NumeroHoras: newHorasT,
            tipoDeTrabalhoHoras: newTipoDeTrabalhoHoras
        });

        setHorasT(newHorasT);
        setShowProjeto(newShowProjeto);
    };

    const matchFoundProjeto = new Array(projetos.length).fill(false);
    const arrayTipoTrabalho = Object.entries(values.tipoDeTrabalhoHoras).map(([key, value]) => ({ _id: key, ...value }));
    let counter = 0;
    return (
        <Wrapper>
            <div className="container">
            <div className="list-group mx-1 w-auto">
                                <div className="row md-3 ">
                    <div className="col-md-12">
                        <h1>{verificaDiaCalled ? 'Editar Dia' : 'Adicionar Dia'}</h1>
                        <FormRow
                            type="date"
                            className="form-control"
                            classNameLabel="form-field-label"
                            classNameInputDate="form__field__date"
                            id="Dia"
                            name="Data"
                            placeholder="Dia Adicionar Horas"
                            value={values.Data ? new Date(values.Data).toLocaleDateString('en-CA') : ''}
                            handleChange={verificaDia}
                        />
                    </div>
                </div>
                
                    <div className="list-group-item">
                        <div className="row mb-3 text-start">
                            <div className="col-md-12 themed-grid-col">
                                <h3>{projeto.Nome}</h3>
                                <br></br>
                            </div>
                            <div className="col-md-12 themed-grid-col text-center">
                                <div className="btn-container">
                                    <div className="row mb-3 text-center" key={"NewDia" + projeto._id}>
                                        {!verificaDiaCalled && (
                                            StringListaTrabalho.split(",").map((t, i) => (
                                                <div className="row mb-3 text-center" key={"NovoDia" + i}>
                                                    <div className="col-md-3 themed-grid-col">
                                                        <p>{t}</p>
                                                    </div>
                                                    <div className="col-md-3 themed-grid-col">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="24"
                                                            id="horas"
                                                            className="horas"
                                                            placeholder="0"
                                                            value={values.tipoDeTrabalhoHoras[projeto.Nome]?.[t]}
                                                            onChange={(e) =>
                                                                handleHorasChange(
                                                                    projeto._id,
                                                                    listaTipoTrabalho[i]._id,
                                                                    projeto.Nome,
                                                                    e
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            )
                                            )
                                        )
                                        }

                                    </div>
                                </div>
                            </div>
                            <div key={"Edit" + projeto._id}>
                                {verificaDiaCalled && values.tipoDeTrabalhoHoras.length !== 0 && Array.isArray(arrayTipoTrabalho) &&
                                    arrayTipoTrabalho.map((item, ID) => {
                                        counter++;
                                        const itemTypeArray = item.tipoTrabalho ? item.tipoTrabalho.split(",") : [];
                                        const matchFound = new Array(itemTypeArray.length + 1).fill(false);
                                        
                                        if (projeto._id === item.projeto) {

                                            const valuesHorasTypeArray = values.tipoDeTrabalhoHoras[projeto._id].horas ? values.tipoDeTrabalhoHoras[projeto._id].horas.split(",") : [];
                                            matchFoundProjeto[projeto._id] = true;
                                            let counter1 = -1;
                                            return (
                                                <div key={"EditarDia" + ID}>
                                                    {StringListaTrabalho.split(",").map((t, i) =>
                                                        itemTypeArray.map((iT, iId) => {
                                                            if (listaTipoTrabalho[i]._id === iT) {
                                                                matchFound[i] = true;
                                                                counter1++;
                                                                return (
                                                                    <div className="row mb-3 text-center" key={"EditarDiaTTFound" + iId}>
                                                                        <div className="col-md-4 text-center themed-grid-col">
                                                                            <p>{t}</p>
                                                                        </div>
                                                                        <div className="col-md-8 text-center themed-grid-col">
                                                                            <input
                                                                                type="number"
                                                                                min="0"
                                                                                max="24"
                                                                                id={`horas-${item._id}`}
                                                                                className="horas"
                                                                                placeholder="0"
                                                                                value={
                                                                                    valuesHorasTypeArray[iId] != null && !isNaN(valuesHorasTypeArray[iId])
                                                                                        ? valuesHorasTypeArray[iId]
                                                                                        : []
                                                                                }
                                                                                onChange={(e) =>
                                                                                    handleHorasChange(
                                                                                        projeto._id,
                                                                                        listaTipoTrabalho[i]._id,
                                                                                        projeto.Nome,
                                                                                        e
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                );
                                                            } else {
                                                                if (iId === itemTypeArray.length - 1) {
                                                                    if (!matchFound[i]) {
                                                                        return (
                                                                            <div className="row mb-3 text-center" key={"EditarDiaTTNotFound" + iId}>
                                                                                <div className="col-md-4 text-center themed-grid-col">
                                                                                    <p>{t}</p>
                                                                                </div>
                                                                                <div className="col-md-8 text-center themed-grid-col">
                                                                                    <input
                                                                                        key={i}
                                                                                        type="number"
                                                                                        min="0"
                                                                                        max="24"
                                                                                        id={`horas-${item._id}`}
                                                                                        className="horas"
                                                                                        placeholder="0"
                                                                                        value={isNaN(values.tipoDeTrabalhoHoras[projeto.Nome]?.[t])}
                                                                                        onChange={(e) =>
                                                                                            handleHorasChange(
                                                                                                projeto._id,
                                                                                                listaTipoTrabalho[i]._id,
                                                                                                projeto.Nome,
                                                                                                e
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        )
                                                    )
                                                    }
                                                </div>
                                            );
                                        }
                                        else {
                                            if (!matchFoundProjeto[projeto._id] && ID === arrayTipoTrabalho.length - 1) {
                                                return (
                                                    <div key={"EditarDiaProjetoNotFound" + projeto._id}>
                                                        {StringListaTrabalho.split(",").map((t, i) => {
                                                            return (
                                                                <div className="row mb-3 text-center" key={"EditarDiaProjetoNotFoundList" + i}>
                                                                    <div className="col-md-4 text-center themed-grid-col" >
                                                                        <p>{t}</p>
                                                                    </div>
                                                                    <div className="col-md-8 text-center themed-grid-col">
                                                                        <input
                                                                            type="number"
                                                                            min="0"
                                                                            max="24"
                                                                            id="horas"
                                                                            className="horas"
                                                                            placeholder="0"
                                                                            value={values.tipoDeTrabalhoHoras[projeto.Nome]?.t}
                                                                            onChange={(e) =>
                                                                                handleHorasChange(
                                                                                    projeto._id,
                                                                                    listaTipoTrabalho[i]._id,
                                                                                    projeto.Nome,
                                                                                    e
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                        )
                                                        }
                                                    </div>
                                                )
                                            }
                                        }
                                    }
                                    )
                                }
                            </div>
                        </div>
                        </div>
                        <div className="card text-center">
                            <div className="card-body">
                                <h5 className="card-title">Total de horas diárias: {horasT} horas</h5>
                            </div>

                            <div className="card-body">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    onClick={(e) => { handleDia(e) }}
                                    className="w-100 btn btn-lg btn-primary"
                                >
                                    {isLoading ? 'loading...' : verificaDiaCalled ? 'Editar Dia' : 'Adicionar Dia'}
                                </button>
                            </div>
                        </div>
                    </div>

            </div>
        </Wrapper>
    );
}
export default ListaProjetos;