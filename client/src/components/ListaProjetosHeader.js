import { AiOutlineArrowDown } from 'react-icons/ai';
import { AiOutlineArrowUp } from 'react-icons/ai';
import { BsArrowLeftShort } from 'react-icons/bs';
import { useState } from 'react';
import Wrapper from '../assets/wrappers/ListaProjetosHeader';

const ListaProjetosHeader = ({ sortValue, handleChange, finalizado }) => {

    const sort =()=>{
        // Projeto
        if(sortValue === "Nome") {
            return true;
        } else if(sortValue === "-Nome"){
            return false;
        }

        //Cliente
        if(sortValue === "Cliente") {
            return true;
        } else if(sortValue === "-Cliente"){
            return false;
        }

        //Notas
        if(sortValue === "Notas") {
            return true;
        } else if(sortValue === "-Notas"){
            return false;
        }

        //DataObjetivo
        if(sortValue === "DataObjetivo") {
            return true;
        } else if(sortValue === "-DataObjetivo"){
            return false;
        }


        //Ação
        if(sortValue === "Acao") {
            return true;
        } else if(sortValue === "-Acao"){
            return false;
        }

        //DataFim
        if(sortValue === "DataFim") {
            return true;
        } else if(sortValue === "-DataFim"){
            return false;
        }

        //DataFim
        if(sortValue === "Resultado") {
            return true;
        } else if(sortValue === "-Resultado"){
            return false;
        }

        return false;
    }


    const [verificaSortCliente, setVerificaSortCliente] = useState(sort);
    const [verificaSortNome, setVerificaSortNome] = useState(sort);
    const [verificaSortNotas, setVerificaSortNotas] = useState(sort);
    const [verificaSortAcoes, setVerificaSortAcoes] = useState(sort);
    const [verificaSortDataObjetivo, setVerificaSortDataObjetivo] = useState(sort);
    const [verificaSortAlertaDias, setVerificaSortAlertaDias] = useState(sort);
    const [verificaSortDataFim, setVerificaSortDataFim] = useState(sort);
    const [verificaSortResultado, setVerificaSortResultado] = useState(sort);
    const [verificaActivo, setVerificaActivo] = useState(sortValue);


    const toggleSort = async (button) => {
        switch (button) {
            case 'Nome': 
                setVerificaActivo('Nome');
                setVerificaSortNome((prevState) => !prevState);
                await handleChange(verificaSortNome ? '-Nome' : 'Nome');
                break;

            case 'Cliente':
                setVerificaActivo('Cliente');
                setVerificaSortCliente(!verificaSortCliente);
                handleChange(verificaSortCliente ? '-Cliente' : 'Cliente');
                break;

            case 'Notas':
                setVerificaActivo('Notas');
                setVerificaSortNotas(!verificaSortNotas);
                await handleChange(verificaSortNotas ? '-Notas' : 'Notas');
                break;

            case 'DataObjetivo':
                setVerificaActivo('DataObjetivo');
                setVerificaSortDataObjetivo(!verificaSortDataObjetivo);
                await handleChange(verificaSortDataObjetivo ? '-DataObjetivo' : 'DataObjetivo');
                break;

            case 'AlertaDias':
                setVerificaActivo('AlertaDias');
                setVerificaSortAlertaDias(!verificaSortAlertaDias);
                await handleChange(verificaSortAlertaDias ? '-DataObjetivo' : 'DataObjetivo');
                break;

            case 'Acao':
                setVerificaActivo('Acao');
                setVerificaSortAcoes(!verificaSortAcoes);
                await handleChange(verificaSortAcoes ? '-Acao' : 'Acao');
                break;

            case 'DataFim':
                setVerificaActivo('DataFim');
                setVerificaSortDataFim(!verificaSortDataFim);
                await handleChange(verificaSortDataFim ? '-DataFim' : 'DataFim');
                break;

            case 'Resultado':
                setVerificaActivo('Resultado');
                setVerificaSortResultado(!verificaSortResultado);
                await handleChange(verificaSortResultado ? '-Resultado' : 'Resultado');
                break;
            default:
                break;
        }
    };

    return (
        <Wrapper>
            <div className="ListaProjetosHeader">
                <div className="list-group-item">
                    
                    <div className="row text-center">
                        <div className="col-md-3 themed-grid-col">
                            <div className="row text-center">
                                <div className="col-md-6 themed-grid-col">
                                    <button
                                        type="button"
                                        name="VisualizarButton"
                                        className="btn buttonHeader"
                                        onClick={() => toggleSort('Cliente')}
                                    >
                                        Cliente{' '}
                                        {verificaActivo === "-Cliente" ?
                                            <AiOutlineArrowUp /> : (verificaActivo === "Cliente" ?
                                                <AiOutlineArrowDown /> : <BsArrowLeftShort />
                                            )
                                        }
                                    </button>
                                </div>
                                <div className="col-md-6 themed-grid-col">
                                    <button
                                        type="button"
                                        name="VisualizarButton"
                                        className="btn buttonHeader"
                                        onClick={() => toggleSort('Nome')}
                                    >
                                        Projeto{' '}
                                        {verificaActivo === "-Nome" ?
                                            <AiOutlineArrowUp /> : (verificaActivo === "Nome" ?
                                                <AiOutlineArrowDown /> : <BsArrowLeftShort />
                                            )
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 themed-grid-col">
                            <div className="row text-center">
                                <div className="col-md-6 themed-grid-col">
                                    <button
                                        type="button"
                                        name="VisualizarButton"
                                        className="btn buttonHeader"
                                        onClick={() => toggleSort('Acao')}
                                    >
                                        Ações{' '}
                                        {verificaActivo === "-Acao" ?
                                            <AiOutlineArrowUp /> : (verificaActivo === "Acao" ?
                                                <AiOutlineArrowDown /> : <BsArrowLeftShort />
                                            )
                                        }
                                    </button>
                                </div>
                                <div className="col-md-6 themed-grid-col">
                                    <button
                                        type="button"
                                        name="VisualizarButton"
                                        className="btn buttonHeader"
                                        onClick={() => toggleSort('Notas')}
                                    >
                                        Notas{' '}
                                        {verificaActivo === "-Notas" ?
                                            <AiOutlineArrowUp /> : (verificaActivo === "Notas" ?
                                                <AiOutlineArrowDown /> : <BsArrowLeftShort />
                                            )
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2 themed-grid-col">
                            <div className="row text-center">
                                {finalizado === true ? (
                                    <>
                                        <div className="col-md-7 themed-grid-col">
                                            <button
                                                type="button"
                                                name="VisualizarButton"
                                                className="btn buttonHeader"
                                                onClick={() => toggleSort('DataFim')}
                                            >

                                                Data Final{' '}
                                                {verificaActivo === "-DataFim" ?
                                                    <AiOutlineArrowUp /> : (verificaActivo === "DataFim" ?
                                                        <AiOutlineArrowDown /> : <BsArrowLeftShort />
                                                    )
                                                }
                                            </button>
                                        </div>
                                        <div className="col-md-5 themed-grid-col">
                                        <button
                                                type="button"
                                                name="VisualizarButton"
                                                className="btn buttonHeader"
                                                onClick={() => toggleSort('Resultado')}
                                            >

                                                Resultado{' '}
                                                {verificaActivo === "-Resultado" ?
                                                    <AiOutlineArrowUp /> : (verificaActivo === "Resultado" ?
                                                        <AiOutlineArrowDown /> : <BsArrowLeftShort />
                                                    )
                                                }
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="col-md-8 themed-grid-col">
                                            <button
                                                type="button"
                                                name="VisualizarButton"
                                                className="btn buttonHeader"
                                                onClick={() => toggleSort('DataObjetivo')}
                                            >
                                                Data Objetivo{' '}

                                                {verificaActivo === "-DataObjetivo" ?
                                                    <AiOutlineArrowUp /> : (verificaActivo === "DataObjetivo" ?
                                                        <AiOutlineArrowDown /> : <BsArrowLeftShort />
                                                    )
                                                }
                                            </button>
                                        </div>
                                        <div className="col-md-4 themed-grid-col">
                                        <p className="btn buttonHeader" disabled>
                                                Alerta dias
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <hr></hr>
                </div></div>
        </Wrapper>
    );
}

export default ListaProjetosHeader;