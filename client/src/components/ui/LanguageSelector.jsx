import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '@/i18n';

/**
 * LanguageSelector — compact PT / EN / ES switch.
 * i18next persists the choice to localStorage (see i18n/index.js).
 */
const Select = styled.select`
  flex: none;
  height: 2.15rem;
  padding: 0 1.6rem 0 0.6rem;
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--grey-700);
  background-color: var(--grey-50);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.4rem center;
  border: 1px solid var(--grey-200);
  border-radius: 999px;
  appearance: none;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: var(--primary-50);
    border-color: var(--primary-300);
    color: var(--primary-700);
  }
  &:focus-visible {
    outline: 2px solid var(--primary-500);
    outline-offset: 2px;
  }
  option {
    color: var(--grey-900);
    background: var(--white);
  }
`;

const LanguageSelector = ({ className }) => {
  const { i18n, t } = useTranslation('common');

  const current = LANGUAGES.some((l) => l.code === i18n.resolvedLanguage)
    ? i18n.resolvedLanguage
    : 'pt';

  return (
    <Select
      className={className}
      value={current}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      title={t('language.label')}
      aria-label={t('language.select')}
    >
      {LANGUAGES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.short}
        </option>
      ))}
    </Select>
  );
};

LanguageSelector.propTypes = { className: PropTypes.string };

export default LanguageSelector;
