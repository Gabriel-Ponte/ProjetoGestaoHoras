import { AiOutlineArrowDown } from 'react-icons/ai';
import { AiOutlineArrowUp } from 'react-icons/ai';
import { BsArrowLeftShort } from 'react-icons/bs';
import { useState } from 'react';
import Wrapper from '../assets/wrappers/ListaProjetosHeader';

const FormRowListaHorasExtraPagasHeader = ({ sortValue, tipoHoras, handleChange, pagas }) => {

    const sort =()=>{
        if(pagas === 3){

        // Numero Horas
        if(sortValue === "Horas") {
            return true;
        } else if(sortValue === "-Horas"){
            return false;
        }

        //Mes
        if(sortValue === "Mes") {
            return true;
        } else if(sortValue === "-Mes"){
            return false;
        }

        //Utilizador
        if(sortValue === "Utilizador") {
            return true;
        } else if(sortValue === "-Utilizador"){
            return false;
        }

        //Responsavel
        if(sortValue === "UtilizadorResponsavel") {
            return true;
        } else if(sortValue === "-UtilizadorResponsavel"){
            return false;
        }
        return false;
                    
    }else{

        //Utilizador
        if(sortValue === "Utilizador") {
            return true;
        } else if(sortValue === "-Utilizador"){
            return false;
        }

        
        // Numero Horas
        if(sortValue === "Data") {
            return true;
        } else if(sortValue === "-Horas"){
            return false;
        }

        //Mes
        if(sortValue === "Horas") {
            return true;
        } else if(sortValue === "-Mes"){
            return false;
        }

        //Horas Extra
        if(sortValue === "nHoras") {
            return true;
        } else if(sortValue === "-nHoras"){
            return false;
        }

        //Tipo de Trabalho
        if(sortValue === "Tipo") {
            return true;
        } else if(sortValue === "-Tipo"){
            return false;
        }
        return false;
                    
        }
    }



    const [verificaSortHoras, setVerificaSortHoras] = useState(sort);
    const [verificaSortUtilizadorResponsavel, setVerificaSortUtilizadorResponsavel] = useState(sort);
    const [verificaSortUtilizador, setVerificaSortUtilizador] = useState(sort);
    const [verificaSortMes, setVerificaMes] = useState(sort);
    const [verificaSortTipo, setVerificaSortTipo] = useState(sort);
    const [verificaSortData, setVerificaSortData] = useState(sort);
    

    const [verificaActivo, setVerificaActivo] = useState(sortValue);

    const toggleSort = async (button) => {
        switch (button) {
            case 'Horas': 
                setVerificaSortHoras((prevState) => !prevState);
                setVerificaActivo(verificaSortHoras ? '-Horas' : 'Horas');
                await handleChange(verificaSortHoras ? '-Horas' : 'Horas');
                break;

            case 'Mes':
                setVerificaMes(!verificaSortMes);            
                setVerificaActivo(verificaSortMes ? '-Mes' : 'Mes');
                handleChange(verificaSortMes ? '-Mes' : 'Mes');
                break;

            case 'Utilizador':
                setVerificaSortUtilizador(!verificaSortUtilizador);
                setVerificaActivo(verificaSortUtilizador ? '-Utilizador' : 'Utilizador');
                await handleChange(verificaSortUtilizador ? '-Utilizador' : 'Utilizador');
                break;

            case 'UtilizadorResponsavel':
                setVerificaSortUtilizadorResponsavel(!verificaSortUtilizadorResponsavel);
                setVerificaActivo(verificaSortUtilizadorResponsavel ? '-UtilizadorResponsavel' : 'UtilizadorResponsavel');
                await handleChange(verificaSortUtilizadorResponsavel ? '-UtilizadorResponsavel' : 'UtilizadorResponsavel');
                break;


            case 'Tipo':
                setVerificaSortTipo(!verificaSortTipo);
                setVerificaActivo(verificaSortTipo ? '-Tipo' : 'Tipo');
                await handleChange(verificaSortTipo ? '-Tipo' : 'Tipo');
                break;

            case 'Data':
                setVerificaSortData(!verificaSortData);
                setVerificaActivo(verificaSortData ? '-Data' : 'Data');
                await handleChange(verificaSortData ? '-Data' : 'Data');
                break;

            default:
                break;
        }




    };

    return (
        <Wrapper>
            <div className="ListaProjetosHeader">
                <div className="list-group-item">
                        <div  className={`${pagas === 0 ? "col-md-11 themed-grid-col" : "col-md-12 themed-grid-col"}`}>
                            <div className="row text-center">
                                {pagas === 3 ? (
                                    <>
                                        <div className="col-md-3 themed-grid-col">
                                            <button
                                                type="button"
                                                name="VisualizarButton"
                                                className="btn buttonHeader"
                                                onClick={() => toggleSort('UtilizadorResponsavel')}
                                            >

                                                Responsavel{' '}
                                                {verificaActivo === "-UtilizadorResponsavel" ?
                                                    <AiOutlineArrowUp /> : (verificaActivo === "UtilizadorResponsavel" ?
                                                        <AiOutlineArrowDown /> : <BsArrowLeftShort />
                                                    )
                                                }
                                            </button>
                                        </div>
                                        <div className="col-md-3 themed-grid-col">
                                        <button
                                                type="button"
                                                name="VisualizarButton"
                                                className="btn buttonHeader"
                                                onClick={() => toggleSort('Utilizador')}
                                            >

                                                Utilizador{' '}
                                                {verificaActivo === "-Utilizador" ?
                                                    <AiOutlineArrowUp /> : (verificaActivo === "Utilizador" ?
                                                        <AiOutlineArrowDown /> : <BsArrowLeftShort />
                                                    )
                                                }
                                            </button>
                                        </div>
                                        <div className="col-md-3 themed-grid-col">
                                        <button
                                                type="button"
                                                name="VisualizarButton"
                                                className="btn buttonHeader"
                                                onClick={() => toggleSort('Mes')}
                                            >

                                                Mes{' '}
                                                {verificaActivo === "-Mes" ?
                                                    <AiOutlineArrowUp /> : (verificaActivo === "Mes" ?
                                                        <AiOutlineArrowDown /> : <BsArrowLeftShort />
                                                    )
                                                }
                                            </button>
                                        </div>
                                        <div className="col-md-3 themed-grid-col">
                                        <button
                                                type="button"
                                                name="VisualizarButton"
                                                className="btn buttonHeader"
                                                onClick={() => toggleSort('Horas')}
                                            >

                                                Numero Horas{' '}
                                                {verificaActivo === "-Horas" ?
                                                    <AiOutlineArrowUp /> : (verificaActivo === "Horas" ?
                                                        <AiOutlineArrowDown /> : <BsArrowLeftShort />
                                                    )
                                                }
                                            </button>
                                        </div>
                                    </>
                                ) : (


                                    <>
                                        <div className="col-md-2 themed-grid-col">
                                        <button
                                                type="button"
                                                name="VisualizarButton"
                                                className="btn buttonHeader"
                                                onClick={() => toggleSort('Utilizador')}
                                            >

                                                Utilizador{' '}
                                                {verificaActivo === "-Utilizador" ?
                                                    <AiOutlineArrowUp /> : (verificaActivo === "Utilizador" ?
                                                        <AiOutlineArrowDown /> : <BsArrowLeftShort />
                                                    )
                                                }
                                            </button>
                                        </div>
                                        <div className="col-md-2 themed-grid-col">
                                        <button
                                                type="button"
                                                name="VisualizarButton"
                                                className="btn buttonHeader"
                                                onClick={() => toggleSort('Data')}
                                            >

                                                Data{' '}
                                                {verificaActivo === "-Data" ?
                                                    <AiOutlineArrowUp /> : (verificaActivo === "Data" ?
                                                        <AiOutlineArrowDown /> : <BsArrowLeftShort />
                                                    )
                                                }
                                            </button>
                                        </div>
                                        <div className="col-md-1 themed-grid-col">
                                        <button
                                                type="button"
                                                name="VisualizarButton"
                                                className="btn buttonHeader"
                                                onClick={() => toggleSort('Horas')}
                                            >

                                                Horas{' '}
                                                {verificaActivo === "-Horas" ?
                                                    <AiOutlineArrowUp /> : (verificaActivo === "Horas" ?
                                                        <AiOutlineArrowDown /> : <BsArrowLeftShort />
                                                    )
                                                }
                                            </button>
                                        </div>

                                        <div className="col-md-2 themed-grid-col">
                                        <button
                                                type="button"
                                                name="VisualizarButton"
                                                className="btn buttonHeader"
                  
                                            >

                                                Horas Extra{' '}
                                            </button>
                                        </div>

                                        {(tipoHoras === 1) ? (
                                        <>
                                        <div className="col-md-1 themed-grid-col">
                                        <button
                                                type="button"
                                                name="VisualizarButton"
                                                className="btn buttonHeader"
                                                onClick={() => toggleSort('nHoras')}
                                            >
                                                Tipo{' '}
                                            </button>
                                        </div>

                                        <div className="col-md-4 themed-grid-col">
                                        <button
                                                type="button"
                                                name="VisualizarButton"
                                                className="btn buttonHeader"
                                                onClick={() => toggleSort('Tipo')}
   
                                            >

                                                Trabalho{' '}
                                                {verificaActivo === "-Tipo" ?   <AiOutlineArrowUp /> : (verificaActivo === "Tipo" ?     <AiOutlineArrowDown /> : <BsArrowLeftShort /> )
                                                }
                                            </button>
                                        </div>
                                        </>
                                         ) : (tipoHoras === 3) ? (
                                        <div className="col-md-5 themed-grid-col">
                                        <button
                                                type="button"
                                                name="VisualizarButton"
                                                className="btn buttonHeader"
      
                                            >
                                                Trabalho{' '}
                                        </button>
                                         </div>) : (
                                            <>
                                            <div className="col-md-1 themed-grid-col">
                                            <button
                                                    type="button"
                                                    name="VisualizarButton"
                                                    className="btn buttonHeader"
                                                    onClick={() => toggleSort('nHoras')}
                                                >
                                                    Tipo{' '}
                                                </button>
                                            </div>

                                            <div className="col-md-4 themed-grid-col">
                                            <button
                                                    type="button"
                                                    name="VisualizarButton"
                                                    className="btn buttonHeader"
        
                                                >

                                                    Trabalho{' '}
                                                </button>
                                            </div>
                                            </>
                                         )}
                                    </>
                                )}
                            </div>

                        </div>
                        <div className="col-md-1 themed-grid-col " >
                        </div>
                    </div>
                    <hr></hr>
                </div>
        </Wrapper>
    );
}

export default FormRowListaHorasExtraPagasHeader;