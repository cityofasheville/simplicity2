import React from 'react';
import PropTypes from 'prop-types';
import mergeProps from './mergeProps';

const getDataColValue = (column) => {
  if (column.id) {
    return column.id;
  }
  return column.expander && 'rt-expandable';
};

const getCustomTrGroupProps = () => ({
  role: 'rowgroup',
});

const getCustomTheadTrProps = () => ({
  role: 'row',
});

const getCustomTrProps = () => ({
  role: 'row',
});

export default function accessibility(WrappedReactTable) {
  class KeyboardNavigableReactTable extends React.Component {
    // The presence of a subcomponent means there is an expander arrow column.
    // This line needs to come before the state.
    hasExpanderCol = !!this.props.SubComponent;
    columnStartIndex = this.hasExpanderCol ? 0 : 1;

    state = {
      focused: {
        row: 1,
        column: 1,
      },
    };

    onSortedChange = (sorted) => {
      // Store the react-table sorted data in this components state.
      this.setState({
        sorted: sorted[0],
      });
    };

    onFocus = (rowIndex, column) => () => {
      const newFocused = {
        row: rowIndex,
        column: this.props.columns.findIndex(c => c.accessor === column.id) + 1,
      };

      this.setState({
        focused: newFocused,
      });
    };

    onKeyDown = rtState => (e) => {
      let focusedCol = this.state.focused.column;
      let focusedRow = this.state.focused.row;

      let changed = false;
      if (e.key === 'ArrowLeft') {
        if (focusedCol > this.columnStartIndex) {
          changed = true;
          focusedCol -= 1;
        }
      } else if (e.key === 'ArrowRight') {
        if (focusedCol < this.props.columns.length) {
          changed = true;
          focusedCol += 1;
        }
      } else if (e.key === 'ArrowUp') {
        if (focusedRow > 0) {
          changed = true;
          focusedRow -= 1;
        }
      } else if (e.key === 'ArrowDown') {
        if (focusedRow < rtState.endRow) {
          changed = true;
          focusedRow += 1;
        }
      } else if (e.key === 'Home') {
        if (e.ctrlKey) {
          if (focusedRow !== 0) {
            changed = true;
            focusedRow = 0;
          }
        }
        if (focusedCol !== this.columnStartIndex) {
          changed = true;
          focusedCol = this.columnStartIndex;
        }
      } else if (e.key === 'End') {
        if (e.ctrlKey) {
          if (focusedRow !== rtState.endRow) {
            changed = true;
            focusedRow = rtState.endRow;
          }
        }
        if (focusedCol !== this.props.columns.length) {
          changed = true;
          focusedCol = this.props.columns.length;
        }
      } else if (e.key === 'PageUp') {
        if (focusedRow !== 0) {
          changed = true;
          focusedRow = 0;
        }
      } else if (e.key === 'PageDown') {
        if (focusedRow !== rtState.endRow) {
          changed = true;
          focusedRow = rtState.endRow;
        }
      } else if (e.key === 'Enter') {
        e.target.click();
      }

      if (changed) {
        e.preventDefault();

        let nodes;
        if (focusedCol === 0 && this.props.SubComponent) {
          nodes = document.querySelectorAll(`[data-row="${focusedRow}"][data-col="rt-expandable"][data-parent="${this.props.tableId}"]`);
        } else {
          nodes = document.querySelectorAll(`[data-row="${focusedRow}"][data-col="${this.props.columns[focusedCol - 1].accessor}"][data-parent="${this.props.tableId}"]`);
        }

        nodes[0].focus();
      }
    };

    getCustomTableProps = () => {
      const props = {
        role: 'grid',
      };

      if (this.props.ariaLabel) {
        props['aria-label'] = this.props.ariaLabel;
      } else if (this.props.ariaLabelledBy) {
        props['aria-labelledby'] = this.props.ariaLabelledBy;
      }

      if (this.props.ariaDescribedBy) {
        props['aria-describedby'] = this.props.ariaDescribedBy;
      }

      return props;
    };

    getCustomTheadThProps = (state, rowInfo, column) => {
      const focusedCol = this.state.focused.column;
      const focusedRow = this.state.focused.row;

      // Determine if Th is focused
      let focused = false;
      if (focusedRow === 0) {
        if (this.hasExpanderCol && focusedCol === 0) {
          if (column.expander) {
            // The expander arrow column doesn't have a column id so it is a special case
            focused = true;
          }
        } else if (this.props.columns[focusedCol - 1].accessor === column.id) {
          focused = true;
        }
      }

      const sorted = this.state.sorted;

      // Determine sorted attribute
      let ariaSort;
      if (sorted && column.id === sorted.id) {
        ariaSort = (sorted.desc ? 'descending' : 'ascending');
      } else {
        ariaSort = 'none';
      }

      return {
        'aria-sort': ariaSort,
        role: 'columnheader',
        tabIndex: focused ? 0 : -1,
        'data-row': 0,
        'data-col': getDataColValue(column),
        'data-parent': this.props.tableId,
        onFocus: this.onFocus(0, column),
        onKeyDown: this.onKeyDown(state),
      };
    };

    getCustomTdProps = (state, rowInfo, column) => {
      const focusedCol = this.state.focused.column;
      const focusedRow = this.state.focused.row;

      // Note that column.id is an id and not an index. Unfortunately there is not a column
      // index in passed in through the params of this function from ReactTable. Likewise, in the
      // props of the wrapped ReactTable component there is no such concept as a column index.
      // As such, we are using the position of the column string ids as an index.

      let focused = false;
      if (focusedRow === rowInfo.viewIndex + 1) {
        if (this.hasExpanderCol && focusedCol === 0) {
          if (column.expander) {
            // The expander arrow column doesn't have a column id so it is a special case
            focused = true;
          }
        } else if (this.props.columns[focusedCol - 1].accessor === column.id) {
          focused = true;
        }
      }

      return {
        role: 'gridcell',
        tabIndex: focused ? 0 : -1,
        'data-row': rowInfo.viewIndex + 1,
        'data-col': getDataColValue(column),
        'data-parent': this.props.tableId,
        onFocus: this.onFocus(rowInfo.viewIndex + 1, column),
        onKeyDown: this.onKeyDown(state),
      };
    };

    render() {
      const newProps = { ...this.props };

      // Table parts that use stateless prop callbacks
      newProps.getTheadProps = mergeProps(getCustomTrGroupProps, this.props.getTheadProps);
      newProps.getTbodyProps = mergeProps(getCustomTrGroupProps, this.props.getTbodyProps);
      newProps.getTheadTrProps = mergeProps(getCustomTheadTrProps, this.props.getTheadTrProps);
      newProps.getTrProps = mergeProps(getCustomTrProps, this.props.getTrProps);

      // Table parts that use stateful prop callbacks
      newProps.getTableProps = mergeProps(this.getCustomTableProps, this.props.getTableProps);
      newProps.getTheadThProps = mergeProps(this.getCustomTheadThProps, this.props.getTheadThProps);
      newProps.getTdProps = mergeProps(this.getCustomTdProps, this.props.getTdProps);

      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return (
        <WrappedReactTable
          {...newProps}
          onSortedChange={this.onSortedChange}
        />
      );
    }
  }

  const myPropTypes = {
    tableId: PropTypes.string.isRequired,
    ariaLabel: PropTypes.string,
    ariaLabelledBy: PropTypes.string,
    ariaDescribedBy: PropTypes.string,
  };

  KeyboardNavigableReactTable.propTypes = { ...WrappedReactTable.propTypes, ...myPropTypes };

  return KeyboardNavigableReactTable;
}
