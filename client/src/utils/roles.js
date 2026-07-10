/**
 * User roles (the `tipo` field) — single source of truth for the numbers that
 * were previously hard-coded across the app. Import ROLE / helpers instead of
 * writing magic numbers like `user.tipo === 6`.
 *
 * The numeric values MUST match what the backend stores.
 */
export const ROLE = {
  ENG_PROCESSOS: 1, // Engenharia de Processos
  ADMIN: 2, // Administrador
  LABORATORIO: 3, // Laboratório
  RECURSOS_HUMANOS: 4, // Recursos Humanos
  ADMIN_ENG: 5, // Administrador Engenharia
  ADMIN_LAB: 6, // Administrador Laboratório
  ADMIN_RH: 7, // Administrador Recursos Humanos
  INATIVO: 8, // Inativo
  RESP_QUALIDADE: 9, // Responsável Qualidade
  GESTOR_FINANCEIRO: 10, // Gestor Financeiro
  COMERCIAL: 11, // Comercial
  LOGISTICA: 12, // Logística
};

/** Read the tipo off the (nested) user object regardless of shape. */
export const getTipo = (user) => user?.user?.tipo ?? user?.tipo;

/** Operational users who only add hours — SharedLayout shows them NavbarGeral. */
export const usesNavbarGeral = (tipo) =>
  [
    ROLE.LABORATORIO,
    ROLE.RECURSOS_HUMANOS,
    ROLE.RESP_QUALIDADE,
    ROLE.GESTOR_FINANCEIRO,
    ROLE.COMERCIAL,
    ROLE.LOGISTICA,
  ].includes(tipo);

/* --- Navbar middle-section shortcuts (which management links a role sees) --- */

/** "Gestão Projetos" button. */
export const showsGestaoProjetos = (tipo) =>
  [ROLE.ENG_PROCESSOS, ROLE.ADMIN, ROLE.ADMIN_ENG, ROLE.ADMIN_RH].includes(tipo);

/** "Gestão Horas" button (tipo 7). */
export const showsGestaoHoras = (tipo) => tipo === ROLE.ADMIN_RH;

/** "Gestão Horas Extra" button (tipo 2 = Administrador, tipo 6). */
export const showsGestaoHorasExtra = (tipo) =>
  [ROLE.ADMIN, ROLE.ADMIN_LAB].includes(tipo);

/** "Horas Projetos" quick action (tipo 2, 7). */
export const showsHorasProjetos = (tipo) =>
  [ROLE.ADMIN, ROLE.ADMIN_RH].includes(tipo);

/* --- page access --- */

/** Projetos area: Principal, Adicionar/Editar/Visualizar Projeto, Horas Projetos. */
export const canAccessProjetos = (tipo) =>
  [ROLE.ENG_PROCESSOS, ROLE.ADMIN, ROLE.ADMIN_ENG, ROLE.ADMIN_RH].includes(tipo); // 1,2,5,7

/** "Gerir Utilizadores" page. */
export const canManageUtilizadores = (tipo) =>
  [ROLE.ADMIN, ROLE.ADMIN_RH].includes(tipo); // 2,7

/** "Adicionar Utilizador" page. */
export const canCreateUtilizador = (tipo) =>
  [ROLE.ADMIN, ROLE.ADMIN_ENG, ROLE.ADMIN_LAB, ROLE.ADMIN_RH].includes(tipo); // 2,5,6,7

/** "Gerir Tipos de Trabalho" page. */
export const canManageTiposTrabalho = (tipo) =>
  [ROLE.ADMIN, ROLE.ADMIN_ENG, ROLE.ADMIN_LAB, ROLE.ADMIN_RH].includes(tipo); // 2,5,6,7

/** Users who add hours through the "geral" form (not projeto-based). */
export const addsHorasGeral = (tipo) =>
  [
    ROLE.LABORATORIO,
    ROLE.RECURSOS_HUMANOS,
    ROLE.ADMIN_LAB,
    ROLE.RESP_QUALIDADE,
    ROLE.GESTOR_FINANCEIRO,
    ROLE.COMERCIAL,
    ROLE.LOGISTICA,
  ].includes(tipo); // 3,4,6,9,10,11,12

/** Access to the "Gerir Horas Extra" page (Admin, Admin Lab, Admin RH). */
export const canManageHorasExtra = (tipo) =>
  [ROLE.ADMIN, ROLE.ADMIN_LAB, ROLE.ADMIN_RH].includes(tipo);

/** Full manager of Horas Extra (sees every tab); Admin is treated like Admin RH. */
export const isHorasExtraFullManager = (tipo) =>
  [ROLE.ADMIN, ROLE.ADMIN_RH].includes(tipo);
