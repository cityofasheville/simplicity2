import React from 'react';
import mergeProps from 'merge-prop-functions';

export default function expandingRows(WrappedReactTable) {
  class ExpandableRowsReactTable extends React.Component {
    constructor(props) {
      super(props);
      this.getCustomTrProps = this.getCustomTrProps.bind(this);
      this.onExpandedChange = this.onExpandedChange.bind(this);
      this.onSortedChange = this.onSortedChange.bind(this);
      this.onFilteredChange = this.onFilteredChange.bind(this);
      this.onPageChange = this.onPageChange.bind(this);
      this.state = {
        expanded: {},
      };
    }

    onExpandedChange(expanded) {
      this.setState({ expanded });
    }

    onSortedChange() {
      this.setState({
        expanded: {},
      });
    }

    onFilteredChange() {
      this.setState({
        expanded: {},
      });
    }

    onPageChange() {
      this.setState({
        expanded: {},
      });
    }

    getCustomTrProps(state, rowInfo) {
      return {
        onClick: () => {
          const expanded = Object.assign({}, this.state.expanded);
          expanded[rowInfo.viewIndex] = !this.state.expanded[rowInfo.viewIndex];
          this.setState({ expanded });
        },
      };
    }

    render() {
      const newProps = Object.assign({}, this.props);
      const getTdProps = newProps.getTrProps;

      let newGetTrProps;
      if (getTdProps) {
        newGetTrProps = mergeProps(this.getCustomTrProps, getTdProps);
        delete newProps.getTrProps;
      } else {
        newGetTrProps = this.getCustomTrProps;
      }

      return (
        <WrappedReactTable
          expanded={this.state.expanded}
          onExpandedChange={this.onExpandedChange}
          onSortedChange={this.onSortedChange}
          onFilteredChange={this.onFilteredChange}
          onPageChange={this.onPageChange}
          getTrProps={newGetTrProps}
          {...newProps}
        />
      );
    }
  }

  ExpandableRowsReactTable.propTypes = WrappedReactTable.propTypes;
  return ExpandableRowsReactTable;
}
