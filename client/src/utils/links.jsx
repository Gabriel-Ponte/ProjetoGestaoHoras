import { ImProfile } from 'react-icons/im';
import { FiUserPlus } from 'react-icons/fi';
import { TbUserExclamation } from 'react-icons/tb';
import { CgWorkAlt } from 'react-icons/cg';
import { AiFillFileAdd } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import { RiSearchEyeLine } from 'react-icons/ri';
import { SiMicrosoftexcel } from 'react-icons/si';

const links = [
  { id: 1, text: 'Editar Perfil', path: '/PaginaEditarPerfil', icon: <ImProfile /> },
  { id: 2, text: 'Adicionar Utilizador', path: '/PaginaAdicionarUtilizador', icon: <FiUserPlus /> },
  { id: 3, text: 'Gerir Utilizadores', path: '/PaginaGerirUtilizadores', icon: <TbUserExclamation /> },
  { id: 4, text: 'Gerir Tipos de Trabalho', path: '/PaginaGerirTipoTrabalho', icon: <CgWorkAlt /> },
  { id: 5, text: 'Adicionar Projeto', path: '/PaginaAdicionarProjeto', icon: <AiFillFileAdd /> },
  { id: 6, text: 'Editar Projetos', path: '/PaginaEditarProjeto', icon: <FiEdit />},
  { id: 7, text: 'Visualizar Projetos', path: '/PaginaVisualizarProjeto', icon: <RiSearchEyeLine /> },
  { id: 8, text: 'Exportar Projetos para Excell', path: '/PaginaPrincipal', icon: <SiMicrosoftexcel /> },
  { id: 9, text: 'Exportar Horas para Excell', path: '/PaginaPrincipal', icon: <SiMicrosoftexcel /> },
];

export default links;
