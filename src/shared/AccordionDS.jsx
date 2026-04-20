function AccordionGroup({ children, className = '' }) {
  return <div className={`flex flex-col ${className}`}>{children}</div>;
}

function AccordionItem({ title, children, name, defaultOpen = false }) {
  return (
    <details
      name={name}
      open={defaultOpen}
      className="rounded mb-4 bg-light border border-gray-300"
    >
      <summary className="list-none flex align-middle justify-between py-2 px-5 cursor-pointer">
        <div className="mr-4">
          <span className="text-coa-blue-dark text-xl font-normal">{title}</span>
        </div>
        <div className="flex items-center">
          <span className="bi bi-chevron-down justify-self-end text-xl" aria-hidden="true"></span>
        </div>
      </summary>
      <div className="entry-content py-4 px-5 border-t bg-white">{children}</div>{' '}
    </details>
  );
}

export { AccordionGroup, AccordionItem };
