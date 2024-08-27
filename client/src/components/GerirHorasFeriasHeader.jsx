import { AiOutlineArrowDown } from 'react-icons/ai';
import { AiOutlineArrowUp } from 'react-icons/ai';
import { BsArrowLeftShort } from 'react-icons/bs';
import { useState } from 'react';
import Wrapper from '../assets/wrappers/ListaProjetosHeader';
import PropTypes from 'prop-types'; 

const GerirHorasFeriasHeader = ({ sortValue, handleChange }) => {

    const sort =()=>{
        
        // Projeto
        if(sortValue === "Inseridos") {
            return true;
        } else if(sortValue === "-Inseridos"){
            return false;
        }

        //Utilizador
        if(sortValue === "Utilizador") {
            return true;
        } else if(sortValue === "-Utilizador"){
            return false;
        }

        //PorDar
        if(sortValue === "PorDar") {
            return true;
        } else if(sortValue === "-PorDar"){
            return false;
        }

        //Ação
        if(sortValue === "Permitidos") {
            return true;
        } else if(sortValue === "-Permitidos"){
            return false;
        }

        return false;
    }


    const [verificaSortUtilizador, setVerificaSortUtilizador] = useState(sort);
    const [verificaSortInseridos, setVerificaSortInseridos] = useState(sort);
    const [verificaSortPorDar, setVerificaSortPorDar] = useState(sort);
    const [verificaSortAcoes, setVerificaSortAcoes] = useState(sort);
    const [verificaActivo, setVerificaActivo] = useState(sortValue);


    const toggleSort = async (button) => {
        switch (button) {
            case 'Inseridos': 
                setVerificaActivo('Inseridos');
                setVerificaSortInseridos((prevState) => !prevState);
                await handleChange(verificaSortInseridos ? '-Inseridos' : 'Inseridos');
                break;

            case 'Utilizador':
                setVerificaActivo('Utilizador');
                setVerificaSortUtilizador(!verificaSortUtilizador);
                handleChange(verificaSortUtilizador ? '-Utilizador' : 'Utilizador');
                break;

            case 'PorDar':
                setVerificaActivo('PorDar');
                setVerificaSortPorDar(!verificaSortPorDar);
                await handleChange(verificaSortPorDar ? '-PorDar' : 'PorDar');
                break;


            case 'Permitidos':
                setVerificaActivo('Permitidos');
                setVerificaSortAcoes(!verificaSortAcoes);
                await handleChange(verificaSortAcoes ? '-Permitidos' : 'Permitidos');
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
                        <div className="col-md-2 themed-grid-col">

                            <button
                                type="button"
                                name="VisualizarButton"
                                className="btn buttonHeader"
                                onClick={() => toggleSort('Utilizador')}
                            >
                                {' '}
                                {verificaActivo === "-Utilizador" ?
                                    <AiOutlineArrowUp /> : (verificaActivo === "Utilizador" ?
                                        <AiOutlineArrowDown /> : <BsArrowLeftShort />
                                    )
                                }
                                Utilizador
                            </button>
                        </div>

                        <div className="col-md-5 themed-grid-col">
                            <div className="row text-center">
                                
                            <div className="col-md-4 themed-grid-col">
                                    <button
                                        type="button"
                                        name="VisualizarButton"
                                        className="btn buttonHeader"
                                        onClick={() => toggleSort('Inseridos')}
                                    >
                                        {' '}
                                        {verificaActivo === "-Inseridos" ?
                                            <AiOutlineArrowUp /> : (verificaActivo === "Inseridos" ?
                                                <AiOutlineArrowDown /> : <BsArrowLeftShort />
                                            )
                                        }
                                        Aceites
                                    </button>
                                </div>
                                 <div className="col-md-4 themed-grid-col">
                                    <button
                                        type="button"
                                        name="VisualizarButton"
                                        className="btn buttonHeader"
                                        onClick={() => toggleSort('Permitidos')}
                                    >
                                        {' '}
                                        {verificaActivo === "-Permitidos" ?
                                            <AiOutlineArrowUp /> : (verificaActivo === "Permitidos" ?
                                                <AiOutlineArrowDown /> : <BsArrowLeftShort />
                                            )
                                        }
                                        Possiveis
                                    </button>
                                </div>

                                <div className="col-md-4 themed-grid-col">
                                    <button
                                        type="button"
                                        name="VisualizarButton"
                                        className="btn buttonHeader"
                                        onClick={() => toggleSort('PorDar')}
                                    >
                                        {' '}
                                        {verificaActivo === "-PorDar" ?
                                            <AiOutlineArrowUp /> : (verificaActivo === "PorDar" ?
                                                <AiOutlineArrowDown /> : <BsArrowLeftShort />
                                            )
                                        }
                                        Por Reclamar
                                    </button>
                                </div>
                                </div>
                                </div>

                                <div className="col-md-1 themed-grid-col">
                                    <h1
                                        name="VisualizarButton"
                                        className="btn buttonHeader"
                                    >
                                        Adicionar
                                    </h1>
                                </div>

                                <div className="col-md-2 themed-grid-col">
                                    <h1
                                        type="button"
                                        name="VisualizarButton"
                                        className="btn buttonHeader"
                                    >
                                        Ano
                                    </h1>
                                </div>
    
                        <div className="col-md-1 themed-grid-col " >
                        </div>
                    </div>
                    <hr></hr>
                </div></div>
        </Wrapper>
    );
}


GerirHorasFeriasHeader.propTypes = {
    sortValue: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
  }

export default GerirHorasFeriasHeader;