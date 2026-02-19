import FlowDiagram from './FlowDiagram';

function MajorDevProcess() {
  return (
    <div className="">
      <h1 className="text-4xl text-coa-blue-medium mb-4">Major Development Process</h1>
      <div>
        <p className="mb-6">
          After the developer submits an application, it goes through a decision-making process that
          includes city staff, elected and appointed city officials, developers, and residents. Who
          is involved at what step depends on the type of project.
        </p>
        <FlowDiagram />
      </div>
    </div>
  );
}

export default MajorDevProcess;
