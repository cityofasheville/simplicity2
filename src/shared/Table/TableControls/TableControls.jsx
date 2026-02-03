import GoToPage from "./GoToPage/GoToPage";
import ItemsPerPage from "./ItemsPerPage/ItemsPerPage";

export default function TableControls({
  navRender,
  pageCount,
  gotoPage,
  pageIndex,
  pageSize,
  setPageSize,
}) {
  return (
    <div className="flex-sm-row m-4">
      {navRender.goToPageRender && (
        <GoToPage
          gotoPage={gotoPage}
          pageIndex={pageIndex}
          pageCount={pageCount}
        />
      )}
      {navRender.itemsPerPageRender && (
        <ItemsPerPage pageSize={pageSize} setPageSize={setPageSize} />
      )}
    </div>
  );
}
