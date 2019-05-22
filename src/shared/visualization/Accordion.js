import React from 'react';
import PropTypes from 'prop-types';

/*
TODO:
allow for more than one - make id unique
*/

class AccordionPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.initiallyExpanded || false,
    };
  }

  render() {
    const panelHeadingId = `accordion-heading-${this.props.index}`;
    const collapsibleId = `accordion-button-${this.props.index}`;

    return (<div className="accordion-item-set">
      <div className={`panel${this.state.open ? ' open' : ''}`}>
        <a
          role="button"
          data-toggle="collapse"
          data-parent="#accordion"
          href={`#${collapsibleId}`}
          aria-expanded={this.state.open}
          aria-controls={collapsibleId}
          onClick={(e) => {
            e.preventDefault();
            this.setState({ open: !this.state.open });
          }}
        >
          <div className="panel-heading" role="tab" id={panelHeadingId}>
            <div className="panel-title">
              {this.props.header}
              <div className={`panel-title-after${this.state.open ? ' open' : ''}`}></div>
            </div>
          </div>
        </a>
        <div
          id={collapsibleId}
          className={`panel-collapse collapse${this.state.open ? ' in' : ''}`}
          role="tabpanel"
          aria-labelledby={panelHeadingId}
        >
          <div className="accordion-panel-body">
            {this.props.body}
          </div>
        </div>
      </div>
    </div>);
  }
}

const Accordion = props => (
  <div
    className="panel-group"
    id="accordion"
    role="tablist"
    aria-multiselectable="true"
  >
    {/* https://getbootstrap.com/docs/3.4/javascript/#collapse */}
    {props.data.map((d, i) => (
      <AccordionPanel
        key={`accordion-item-${i}`}
        index={i}
        header={d.header}
        body={d.body}
        initiallyExpanded={d.selected}
      />))}
  </div>
)

export default Accordion;
