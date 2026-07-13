import { ImProfile } from 'react-icons/im';
import { FiUserPlus } from 'react-icons/fi';
import { TbUserExclamation } from 'react-icons/tb';
import { CgWorkAlt } from 'react-icons/cg';
import { AiFillFileAdd } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import { RiSearchEyeLine } from 'react-icons/ri';
import { PiMicrosoftExcelLogoFill } from 'react-icons/pi';

// `textKey` is a stable i18n key inside the `layout` namespace (see
// src/locales/<lng>/layout.json). It is resolved with t() at the render site
// (NavLinks.jsx) so the labels re-render when the language changes.
const links = [
  { id: 1, textKey: 'links.editarPerfil', path: '/PaginaEditarPerfil', icon: <ImProfile /> },
  { id: 2, textKey: 'links.adicionarUtilizador', path: '/PaginaAdicionarUtilizador', icon: <FiUserPlus /> },
  { id: 3, textKey: 'links.gerirUtilizadores', path: '/PaginaGerirUtilizadores', icon: <TbUserExclamation /> },
  { id: 4, textKey: 'links.gerirTiposTrabalho', path: '/PaginaGerirTipoTrabalho', icon: <CgWorkAlt /> },
  { id: 5, textKey: 'links.adicionarProjeto', path: '/PaginaAdicionarProjeto', icon: <AiFillFileAdd /> },
  { id: 6, textKey: 'links.editarProjetos', path: '/PaginaEditarProjeto', icon: <FiEdit /> },
  { id: 7, textKey: 'links.visualizarProjetos', path: '/PaginaVisualizarProjeto', icon: <RiSearchEyeLine /> },
  { id: 8, textKey: 'links.exportarProjetosExcel', path: '/PaginaPrincipal', icon: <PiMicrosoftExcelLogoFill /> },
  { id: 9, textKey: 'links.exportarHorasExcel', path: '/PaginaPrincipal', icon: <PiMicrosoftExcelLogoFill /> },
];

export default links;
