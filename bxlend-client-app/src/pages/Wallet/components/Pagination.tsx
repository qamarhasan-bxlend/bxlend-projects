import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';

export type PaginationPropsInterface = {
  nPages: number;
  currentPage: number;
  // eslint-disable-next-line no-unused-vars
  setCurrentPage: (currentPage: number) => void;
};

const Pagination = ({ nPages, currentPage, setCurrentPage }: PaginationPropsInterface) => {
  const pageNumbers = [...Array(nPages + 1).keys()].slice(1);
  const nextPage = () => {
    if (currentPage !== nPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };
  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination pagination-flush justify-content-end">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={prevPage}>
            <ChevronLeft width="1.25rem" height="1.25rem" />
          </button>
        </li>
        {pageNumbers.map((pgNumber) => (
          <li key={pgNumber} className={`page-item ${currentPage === pgNumber ? 'active' : ''} `}>
            <button className="page-link" onClick={() => setCurrentPage(pgNumber)}>
              {pgNumber}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === nPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={nextPage}>
            <ChevronRight width="1.25rem" height="1.25rem" />
          </button>
        </li>
      </ul>
    </nav>
  );
};
export default Pagination;
