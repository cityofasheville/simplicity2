import SuggestSearchWrapper from '../../search/SuggestSearchWrapper';

function MajorDevSearch() {
  return (
    <div className="">
      <h1 className="text-4xl text-coa-blue-medium mb-6">Search for Permits by Address or ID</h1>
      <SuggestSearchWrapper searchMode="permit" />
    </div>
  );
}

export default MajorDevSearch;
