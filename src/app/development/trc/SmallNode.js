import React from 'react';
import TypePuck from './TypePuck';
import { decisionIconHeader, trcProjectTypes } from './textContent';
import LargeNodeContents from './LargeNodeContents';
import * as Dialog from '@radix-ui/react-dialog';

function SmallNode({ node, yOffset, edgeStroke, clickAction }) {
  let content;
  if (node.subNodes) {
    content = (
      <div>
        {node.subNodes.map((sub, subIndex) => (
          <div style={{ padding: subIndex > 0 ? '1rem 0 0' : 0 }} key={sub.id}>
            {sub.id}: {sub.steps.what}
          </div>
        ))}
      </div>
    );
  } else if (node.decisionNode) {
    content = <div>{decisionIconHeader}</div>;
  } else if (!node.subNodes && node.steps) {
    content = node.steps.what;
  }

  return (
    <foreignObject
      x={node.x - node.wrap / 2}
      y={node.y - yOffset}
      width={node.wrap}
      height={node.height}
      key={`node-${node.id}`}
      style={{ overflow: 'visible' }}
    >
      <div
        className=""
        id={`${node.htmlId}`}
        style={{
          border: `${edgeStroke}px solid #e6e6e6`,
          backgroundColor: 'white',
          borderRadius: '6px',
        }}
      >
        <div className="px-2">
          <ul
            className="flex gap-1 flex-wrap mt-2 mb-1"
            aria-label={`Relevant permit types for step: ${node.id}`}
          >
            {node.typeIds.map((id) => (
              <li key={`${node.id}-puck-${id}`}>
                <TypePuck typeObject={trcProjectTypes[id]} size={30} textClass="text-sm" />
              </li>
            ))}
          </ul>
          <h2 className="text-base md:text-lg font-normal border-b mb-2">{node.id}</h2>
          <div
            className="pb-2 max-h-32 overflow-hidden "
            // max height was 100px, originally
          >
            {content}
          </div>
          {!node.decisionNode && (
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button className="w-full btn btn-sm btn-primary py-0 mb-2">Full Details</button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70" />
                <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-6 border rounded shadow-lg w-[90vw] max-w-lg max-h-[85vh] overflow-y-auto">
                  <div className="hidden">
                    <Dialog.Title>
                      Included to suppress warning about missing title, but the title is provided in
                      the header of the modal content, so this is intentionally hidden.
                    </Dialog.Title>
                  </div>
                  <div className="flex items-center justify-end">
                    <Dialog.Close asChild>
                      <button className="p-1 mr-1 my-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <i className="bi bi-x-lg"></i>
                        <span className="sr-only">Return to process</span>
                      </button>
                    </Dialog.Close>
                  </div>
                  <LargeNodeContents node={node} yOffset={yOffset} edgeStroke={edgeStroke} />
                  <div className="flex items-center justify-center my-2">
                    <Dialog.Close asChild>
                      <button className="btn btn-sm btn-primary py-0">Return to Process</button>
                    </Dialog.Close>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          )}
        </div>
      </div>
    </foreignObject>
  );
}

export default SmallNode;
