import React from 'react';
import PropTypes from 'prop-types';


class Tooltip extends React.Component {

	constructor() {
		super()
	}

	render() {
		const styles = this.props.style || {}
		styles.fontSize = '1.5rem'
		styles.padding = '0.5rem'
		const minWidth = Math.min(
			(this.props.textLines.map(line => line.text).join('').length + 0.5) / this.props.textLines.length,
			20
		)
		styles.minWidth = `${minWidth}rem`
		return <div style={styles}>
			<div style={{fontWeight: 'bolder', textAlign: 'center'}}>
				{this.props.title}
			</div>
			{this.props.textLines.map((lineObj, i) =>
				<div key={`textLine-${i}`} style={{color: lineObj.color}}>{lineObj.text}</div>
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
	title: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	])
}

Tooltip.defaultProps = {
	textLines: [],
	title: ''
}

export default Tooltip;
