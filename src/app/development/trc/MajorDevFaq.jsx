// import Accordion from '../../../shared/Accordion';
import { AccordionGroup, AccordionItem } from '../../../shared/AccordionDS';

function MajorDevFaq() {
  const faqs = [
    {
      header: 'How current is this data?',
      body: 'Data in SimpliCity is updated nightly.',
    },
    {
      header: 'Where is the Development Services Department?',
      body: (
        <div>
          <a href="https://goo.gl/maps/sKweCmhK4iiEuz7t6" target="_blank" rel="noopener noreferrer">
            161 South Charlotte Street
          </a>
          , down the hill from City Hall.
        </div>
      ),
    },
    {
      header: 'Where is City Hall?',
      body: (
        <div>
          <a href="https://goo.gl/maps/FWoy1aRrV1ktdF8T7" target="_blank" rel="noopener noreferrer">
            70 Court Plaza
          </a>
          , off of College Street.
        </div>
      ),
    },
    {
      header: 'Who builds these projects?',
      body: 'Small business owners, land owners, developers, and other private investors submit applications for permission to develop property in the city.  Once approved, they work with private contractors.',
    },
    {
      header: 'Who should I talk to if I have questions about one of these projects?',
      body: 'Give our Planner of the Day a call at 828-259-5450 or email them at pod@ashevillenc.gov.  They will direct you to the city planner who is reviewing the application.',
    },
    {
      header: 'How can I tell if a project includes affordable housing?',
      body: 'If the developer has indicated that they are planning to include affordable housing, it will be indicated on the project page with an icon.  Throughout the process, a developer could alter their plans, and this may not be reflected on the project page immediately.',
    },
    {
      header: 'How can I join one of the commissions that reviews projects?',
      body: (
        <div>
          Visit{' '}
          <a
            href="https://ashevillenc.gov/department/city-clerk/boards-and-commissions/"
            target="_blank"
            rel="noopener noreferrer"
          >
            the Boards and Commissions web page
          </a>{' '}
          to view current vacancies and learn about application steps.
        </div>
      ),
    },
    {
      header: 'I still have a question!',
      body: (
        <div>
          <p>
            If your question was not answered here, please{' '}
            <a href="https://forms.gle/CkkihZfs37opZfXM8" target="_blank" rel="noopener noreferrer">
              let us know what it was
            </a>{' '}
            so that we can improve this page. If you have a question to which you need a response,
            please email pod@ashevillenc.gov instead.
          </p>
          <p>
            If you have thoughts about to improve this tool, please{' '}
            <a href="https://forms.gle/kSRTZidJUtNdZ8Rz7" rel="noopener noreferrer" target="_blank">
              tell us
            </a>
            .
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="">
      <h1 className="text-4xl text-coa-blue-medium my-5">Major Development FAQ</h1>

      <AccordionGroup>
        {faqs.map((faq, index) => (
          <AccordionItem key={index} title={faq.header}>
            {faq.body}
          </AccordionItem>
        ))}
      </AccordionGroup>
    </div>
  );
}

export default MajorDevFaq;
