import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import Wrapper from '@/styles/PageBtnContainer';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { changePage } from '@/features/allProjetos/allProjetosSlice';
import PropTypes from 'prop-types';

const PageBtnContainer = ({ small }) => {
  const { t } = useTranslation('layout');
  const { numOfPages, page } = useSelector((store) => store.allProjetos);
  const dispatch = useDispatch();
  const small1 = small;
  const pages = Array.from({ length: numOfPages }, (_, index) => {
    return index + 1;
  });
  // if (small) {

  // }

  const nextPage = () => {
    let newPage = page + 1;
    if (newPage > numOfPages) {
      newPage = 1;
    }
    dispatch(changePage(newPage));
  };
  const prevPage = () => {
    let newPage = page - 1;
    if (newPage < 1) {
      newPage = numOfPages;
    }
    dispatch(changePage(newPage));
  };
  return (
    <Wrapper>
      {(!small1) ? (
        <div className="row">
          <button type='button' className='prev-btn' onClick={prevPage}>
            <HiChevronDoubleLeft />
            {t('pagination.previous')}
          </button>
            {pages.map((pageNumber) => {
  
              return (
                <button
                  type='button'
                  key={pageNumber}
                  className={pageNumber === page ? 'pageBtn active' : 'pageBtn'}
                  onClick={() => dispatch(changePage(pageNumber))}
                >
                  {pageNumber}
                </button>
              );
            })}
          <button type='button' className='next-btn' onClick={nextPage}>
            {t('pagination.next')}
            <HiChevronDoubleRight />
          </button>
        </div>

      ) : (
        <div className='row'>
          <button
            type='button'
            className='prev-btn'
            onClick={prevPage}
            aria-label={t('pagination.previous')}
          >
            <HiChevronDoubleLeft />
          </button>
          <p className={page ? 'pageBtn active' : 'pageBtn'}>{page}</p>
          <button
            type='button'
            className='next-btn'
            onClick={nextPage}
            aria-label={t('pagination.next')}
          >
            <HiChevronDoubleRight />
          </button>
        </div>
      )}

    </Wrapper>
  );

};

PageBtnContainer.propTypes = {
  small: PropTypes.bool.isRequired,
}

export default PageBtnContainer;
