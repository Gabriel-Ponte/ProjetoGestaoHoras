import { AiOutlineArrowDown } from 'react-icons/ai';
import { AiOutlineArrowUp } from 'react-icons/ai';
import { BsArrowLeftShort } from 'react-icons/bs';
import { useState } from 'react';
import Wrapper from '../assets/wrappers/ListaProjetos';

const ListaProjetosHeader = ({ sortValue, handleChange }) => {
    const [verificaSortTema, setVerificaSortTema] = useState(false);
    const [verificaSortNome, setVerificaSortNome] = useState(false);
    const [verificaSortNotas, setVerificaSortNotas] = useState(false);
    const [verificaSortAcoes, setVerificaSortAcoes] = useState(false);
    const [verificaSortDataObjetivo, setVerificaSortDataObjetivo] = useState(false);
    const [verificaSortAlertaDias, setVerificaSortAlertaDias] = useState(false);
    const [verificaActivo, setVerificaActivo] = useState(sortValue);

    const toggleSort = (button) => {
        switch (button) {
            case 'Nome':
                setVerificaActivo('Nome');
                setVerificaSortNome(!verificaSortNome);
                handleChange(verificaSortNome ? 'Nome' : '-Nome');
                break;
            case 'Tema':
                setVerificaActivo('Tema');
                setVerificaSortTema(!verificaSortTema);
                handleChange(verificaSortTema ? 'Tema' : '-Tema');
                break;
            case 'Notas':
                setVerificaActivo('Notas');
                setVerificaSortNotas(!verificaSortNotas);
                handleChange(verificaSortNotas ? 'Notas' : '-Notas');
                break;
            case 'DataObjetivo':
                setVerificaActivo('DataObjetivo');
                setVerificaSortDataObjetivo(!verificaSortDataObjetivo);
                handleChange(verificaSortDataObjetivo ? 'DataObjetivo' : '-DataObjetivo');
                break;
            case 'AlertaDias':
                setVerificaActivo('AlertaDias');
                setVerificaSortAlertaDias(!verificaSortAlertaDias);
                handleChange(verificaSortAlertaDias ? 'DataObjetivo' : '-DataObjetivo');
                break;
            case 'Acao':
                setVerificaActivo('Acao');
                setVerificaSortAcoes(!verificaSortAcoes);
                handleChange(verificaSortAcoes ? 'Acao' : '-Acao');
                break;
            default:
                break;
        }
    };

    return (
        <Wrapper>
            <div className="ListaProjetosHeader">
        <div className="list-group-item">
            <div className="row mb-3 text-center">
                <div className="col-md-3 themed-grid-col">
                    <div className="row mb-3 text-center">
                        <div className="col-md-6 themed-grid-col">
                            <button
                                type="button"
                                name="VisualizarButton"
                                className="btn"
                                onClick={() => toggleSort('Tema')}
                            >
                                Tema {verificaActivo === "Tema" || verificaActivo === "-Tema"  ? verificaSortNome ? <AiOutlineArrowUp /> : <AiOutlineArrowDown /> : <BsArrowLeftShort />}
                            </button>
                        </div>
                        <div className="col-md-6 themed-grid-col">
                            <button
                                type="button"
                                name="VisualizarButton"
                                className="btn"
                                onClick={() => toggleSort('Nome')}
                            >
                                Projeto {verificaActivo === "Nome" ||verificaActivo === "-Nome"   ? verificaSortTema ? <AiOutlineArrowUp /> : <AiOutlineArrowDown /> : <BsArrowLeftShort />}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 themed-grid-col">
                    <div className="row mb-3 text-center">

                        <div className="col-md-6 themed-grid-col">
                            <button
                                type="button"
                                name="VisualizarButton"
                                className="btn"
                                onClick={() => toggleSort('Acao')}
                            >
                                Ações {verificaActivo === "Acao" ||  verificaActivo === "-Acao" ? (verificaSortAcoes ? <AiOutlineArrowUp /> : <AiOutlineArrowDown />) : <BsArrowLeftShort /> }
                            </button>
                        </div>
                        <div className="col-md-6 themed-grid-col">
                            <button
                                type="button"
                                name="VisualizarButton"
                                className="btn"
                                onClick={() => toggleSort('Notas')}
                            >
                                Notas {verificaActivo === "Notas" || verificaActivo === "-Notas" ? verificaSortNotas ? <AiOutlineArrowUp /> : <AiOutlineArrowDown /> : <BsArrowLeftShort />}
                            </button>
                        </div>
                    </div>
                </div>


                <div className="col-md-3 themed-grid-col">
                    <div className="row mb-3 text-center">
                        <div className="col-md-6 themed-grid-col">
                            <button
                                type="button"
                                name="VisualizarButton"
                                className="btn "
                                onClick={() => toggleSort('DataObjetivo')}
                            >
                                DataObjetivo{' '}
                                {verificaActivo === "DataObjetivo"  ||  verificaActivo === "-DataObjetivo"  ? verificaSortDataObjetivo ? <AiOutlineArrowUp /> : <AiOutlineArrowDown /> : <BsArrowLeftShort />}
                            </button>
                        </div>
                        <div className="col-md-6 themed-grid-col">
                            <button
                                type="button"
                                name="VisualizarButton"
                                className="btn "
                                onClick={() => toggleSort('AlertaDias')}
                            >
                            Alerta Dias {verificaActivo === "AlertaDias" ||   verificaActivo === "-DataObjetivo"? verificaSortAlertaDias ? <AiOutlineArrowUp /> : <AiOutlineArrowDown /> : <BsArrowLeftShort />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <hr></hr>
        </div></div>
        </Wrapper>
    );
}

export default ListaProjetosHeader;