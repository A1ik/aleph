import React, { Component } from 'react';
import { min } from 'lodash';
import {FormattedDate} from 'react-intl';

class Earliest extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.values !== nextProps.values;
  }
  
  render() {
    const earliest = min(this.props.values);
    return <Date value={earliest} />
  }
}


class Date extends Component {
  static Earliest = Earliest;

  shouldComponentUpdate(nextProps) {
    return this.props.value !== nextProps.value;
  }

  render() {
    const { value: dateString } = this.props;
    if (!dateString) return null;
    const availableChunks = dateString.split(/-/);
    const dateObject = Reflect.construct(window.Date, [dateString]);
    return <FormattedDate
      value={dateObject}
      year='numeric'
      month={availableChunks[1] && 'long'}
      day={availableChunks[2] && 'numeric'}
    />
  }
}

export default Date;
