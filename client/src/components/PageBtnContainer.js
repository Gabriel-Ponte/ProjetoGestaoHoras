import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import Wrapper from '../assets/wrappers/PageBtnContainer';
import { useSelector, useDispatch } from 'react-redux';
import { changePage } from '../features/allProjetos/allProjetosSlice';

const PageBtnContainer = ({ small }) => {
  const { numOfPages, page } = useSelector((store) => store.allProjetos);
  const dispatch = useDispatch();
  const small1 = small;
  const pages = Array.from({ length: numOfPages }, (_, index) => {
    return index + 1;
  });
  //console.log(small.small);
  if (small) {
    console.log(small);
  }

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
            Anterior
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
            Proximo
            <HiChevronDoubleRight />
          </button>
        </div>

      ) : (
        <div className='row'>
          <button type='button' className='prev-btn' onClick={prevPage}>
            <HiChevronDoubleLeft />
          </button>
          <p className={page ? 'pageBtn active' : 'pageBtn'}>{page}</p>
          <button type='button' className='next-btn' onClick={nextPage}>
            <HiChevronDoubleRight />
          </button>
        </div>
      )}

    </Wrapper>
  );

};
export default PageBtnContainer;
