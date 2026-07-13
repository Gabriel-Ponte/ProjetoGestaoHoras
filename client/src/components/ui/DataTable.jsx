import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';

/**
 * DataTable — one consistent table for lists across the app.
 *
 * <DataTable
 *   columns={[
 *     { key: 'cliente', header: 'Cliente', sortable: true },
 *     { key: 'nome', header: 'Projeto', render: (r) => <b>{r.nome}</b> },
 *     { key: 'alerta', header: 'Alerta', align: 'center' },
 *   ]}
 *   data={projetos}
 *   keyField="_id"
 *   loading={isLoading}
 *   sortKey={sortKey} sortDir={sortDir} onSort={handleSort}
 * />
 */
const Wrap = styled.div`
  width: 100%;
  border: 1px solid var(--grey-200);
  border-radius: 10px;
  overflow: hidden;
  background: var(--white);

  .table-scroll {
    width: 100%;
    overflow-x: auto;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }
  thead th {
    position: ${(p) => (p.$stickyHeader ? 'sticky' : 'static')};
    top: var(--navbar-height, 0px);
    z-index: 2;
    background: var(--grey-100);
    color: var(--grey-600);
    font-weight: 600;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    text-align: left;
    white-space: nowrap;
    padding: 0.7rem 0.9rem;
    border-bottom: 1px solid var(--grey-200);
  }
  thead th.align-center { text-align: center; }
  thead th.align-right { text-align: right; }

  .th-sort {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    text-transform: inherit;
    letter-spacing: inherit;
    color: inherit;
    cursor: pointer;
  }
  .th-sort:hover { color: var(--primary-600); }
  .th-sort svg { opacity: 0.65; font-size: 0.85em; }

  tbody td {
    padding: 0.75rem 0.9rem;
    border-bottom: 1px solid var(--grey-100);
    color: var(--grey-700);
    vertical-align: middle;
  }
  tbody td.align-center { text-align: center; }
  tbody td.align-right { text-align: right; }
  tbody tr:last-child td { border-bottom: none; }
  tbody tr {
    transition: background 0.15s ease;
  }
  tbody tr.clickable { cursor: pointer; }
  tbody tr:hover { background: var(--primary-50); }

  .table-state {
    padding: 2.5rem 1rem;
  }
`;

const alignClass = (a) => (a === 'center' ? 'align-center' : a === 'right' ? 'align-right' : '');

const DataTable = ({
  columns,
  data = [],
  keyField = 'id',
  loading = false,
  error = null,
  onRetry,
  emptyTitle,
  emptyMessage,
  stickyHeader = false,
  sortKey,
  sortDir,
  onSort,
  onRowClick,
  className,
}) => {
  const { t } = useTranslation('common');
  const colSpan = columns.length;

  const renderBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={colSpan} className="table-state">
            <LoadingState inline />
          </td>
        </tr>
      );
    }
    if (error) {
      return (
        <tr>
          <td colSpan={colSpan} className="table-state">
            <ErrorState message={typeof error === 'string' ? error : undefined} onRetry={onRetry} inline />
          </td>
        </tr>
      );
    }
    if (!data.length) {
      return (
        <tr>
          <td colSpan={colSpan} className="table-state">
            <EmptyState
              title={emptyTitle === undefined ? t('state.emptyTitle') : emptyTitle}
              message={emptyMessage === undefined ? t('state.emptyMessage') : emptyMessage}
              inline
            />
          </td>
        </tr>
      );
    }
    return data.map((row, i) => (
      <tr
        key={row[keyField] ?? i}
        className={onRowClick ? 'clickable' : undefined}
        onClick={onRowClick ? () => onRowClick(row) : undefined}
      >
        {columns.map((col) => (
          <td key={col.key} className={alignClass(col.align)}>
            {col.render ? col.render(row) : row[col.key]}
          </td>
        ))}
      </tr>
    ));
  };

  const sortIcon = (key) => {
    if (sortKey !== key) return <FaSort />;
    return sortDir === 'desc' ? <FaSortDown /> : <FaSortUp />;
  };

  return (
    <Wrap $stickyHeader={stickyHeader} className={className}>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={alignClass(col.align)} style={col.width ? { width: col.width } : undefined}>
                  {col.sortable && onSort ? (
                    <button type="button" className="th-sort" onClick={() => onSort(col.key)}>
                      {col.header}
                      {sortIcon(col.key)}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{renderBody()}</tbody>
        </table>
      </div>
    </Wrap>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      header: PropTypes.node,
      render: PropTypes.func,
      align: PropTypes.oneOf(['left', 'center', 'right']),
      width: PropTypes.string,
      sortable: PropTypes.bool,
    })
  ).isRequired,
  data: PropTypes.array,
  keyField: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onRetry: PropTypes.func,
  emptyTitle: PropTypes.string,
  emptyMessage: PropTypes.string,
  stickyHeader: PropTypes.bool,
  sortKey: PropTypes.string,
  sortDir: PropTypes.oneOf(['asc', 'desc']),
  onSort: PropTypes.func,
  onRowClick: PropTypes.func,
  className: PropTypes.string,
};

export default DataTable;
