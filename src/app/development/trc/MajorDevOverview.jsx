import MajorDevTypes from './MajorDevTypes';

function MajorDevOverview() {
  return (
    <>
      <div className="pb-8">
        <h1 className="text-4xl text-coa-blue-medium mb-6">Large-Scale Development in Asheville</h1>
        <p className="mb-2">
          There is a lot of private land development happening in Asheville. This tool can help you:
        </p>
        <ul className="list-disc ml-10 mb-2">
          <li className="">
            Understand the development process from the first permit application to breaking ground
          </li>
          <li>Understand your role in the process and how your voice can be heard</li>
          <li>
            <a href="https://notifications.ashevillenc.gov" rel=" noreferrer">
              Sign up to be notified{' '}
              <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
              <span className="sr-only">(external site)</span>
            </a>{' '}
            when someone applies for a permit to build something near you
          </li>
        </ul>
        <p>
          Do you have ideas for how this tool could be updated or refined to better serve our
          community? If so, please{' '}
          <a href="https://forms.gle/kSRTZidJUtNdZ8Rz7" rel=" noreferrer">
            send us your feedback{' '}
            <i className="bi bi-box-arrow-up-right text-sm" aria-hidden="true"></i>
            <span className="sr-only">(external site)</span>
          </a>
          !
        </p>
      </div>
      <MajorDevTypes />
    </>
  );
}

export default MajorDevOverview;
