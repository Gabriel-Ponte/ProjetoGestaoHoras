import { ImProfile } from 'react-icons/im';
import { FiUserPlus } from 'react-icons/fi';
import { FiEdit } from 'react-icons/fi';
import { IoStopwatchSharp } from 'react-icons/io5';
import { RiSearchEyeLine } from 'react-icons/ri';
import { AiFillFileAdd } from 'react-icons/ai';



const links = [
  { id: 1, text: 'Editar Perfil', path: '/PaginaEditarPerfil', icon: <ImProfile /> },
  { id: 2, text: 'Adicionar Horas', path: '/PaginaAdicionarHoras', icon: <IoStopwatchSharp /> },
  { id: 3, text: 'Adicionar Utilizador', path: '/PaginaAdicionarUtilizador', icon: <FiUserPlus /> },
  { id: 4, text: 'Adicionar Projeto', path: '/PaginaAdicionarProjeto', icon: <AiFillFileAdd /> },
  { id: 5, text: 'Editar Projetos', path: '/PaginaEditarProjeto', icon: <FiEdit /> },
  { id: 6, text: 'Visualizar Projetos', path: '/PaginaVisualizarProjeto', icon: <RiSearchEyeLine /> },
];


export default links;
