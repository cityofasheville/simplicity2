export default function ItemsPerPage({ pageSize, setPageSize }) {
  return (
    <div className="d-inline m-4 dropdown">
      <select
        class="btn btn-outline-secondary dropdown-toggle"
        value={pageSize}
        onChange={(e) => {
          setPageSize(Number(e.target.value));
        }}
      >
        {/* {console.log(pageSize)} */}
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </div>
  );
}
