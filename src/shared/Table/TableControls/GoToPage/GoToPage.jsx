export default function GoToPage({ gotoPage, pageIndex, pageCount }) {
  const dropdownOptions = Array.from(
    { length: pageCount },
    (_, index) => index + 1
  );

  return (
    <div className="d-inline  mb-4 dropdown">
      Go to page{" "}
      <select
        class="btn btn-outline-secondary dropdown-toggle"
        value={pageIndex + 1}
        onChange={(e) => {
          gotoPage(Number(e.target.value) - 1);
        }}
      >
        {dropdownOptions.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
}
