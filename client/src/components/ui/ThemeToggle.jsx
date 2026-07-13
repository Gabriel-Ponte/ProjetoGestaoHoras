import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/context/ThemeContext';

/**
 * ThemeToggle — light/dark switch. Flips the design tokens app-wide
 * (see the [data-theme='dark'] block in index.css).
 */
const Btn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 2.15rem;
  height: 2.15rem;
  padding: 0;
  border: 1px solid var(--grey-200);
  border-radius: 999px;
  background: var(--grey-50);
  color: var(--grey-700);
  font-size: 1.05rem;
  line-height: 1;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background: var(--primary-50);
    border-color: var(--primary-300);
    color: var(--primary-700);
  }
  &:focus-visible {
    outline: 2px solid var(--primary-500);
    outline-offset: 2px;
  }
`;

const ThemeToggle = ({ className }) => {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useTranslation('common');

  const label = isDark ? t('theme.toggleToLight') : t('theme.toggleToDark');

  return (
    <Btn
      type="button"
      className={className}
      onClick={toggleTheme}
      title={label}
      aria-label={label}
    >
      {isDark ? <FiSun /> : <FiMoon />}
    </Btn>
  );
};

ThemeToggle.propTypes = { className: PropTypes.string };

export default ThemeToggle;
