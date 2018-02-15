import React from 'react';
import PropTypes from 'prop-types';


class Tooltip extends React.Component {

	constructor() {
		super()
	}

	render() {
		return <div>
			<div style={{fontSize: '1.5rem'}}>{this.props.title}</div>
			{this.props.textLines.map(lineObj =>
				<div key={lineObj.text} style={{color: lineObj.color}}>{lineObj.text}</div>
			)}
		</div>
	}
}

Tooltip.propTypes = {
	textLines: PropTypes.arrayOf(PropTypes.object),
	/* Array format of [
		{
			text: "blabalbla",
			color: "blablabla"
		},
	] */
	title: PropTypes.string
}

Tooltip.defaultProps = {
	textLines: [],
	title: ''
}

export default Tooltip;
