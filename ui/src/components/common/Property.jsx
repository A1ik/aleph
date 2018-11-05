import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import Entity from 'src/components/common/Entity';
import { Country, Date, URL } from 'src/components/common';
import { selectMetadata } from 'src/selectors';
import wordList from 'src/util/wordList';
import ensureArray from 'src/util/ensureArray';

import './Property.css';

class Value extends PureComponent {
  render() {
    const { value, model } = this.props;
    if (!value) {
      return null;
    }
    if (model.type === 'country') {
      return <Country.Name code={value} />;
    }
    if (model.type === 'url') {
      return <URL value={value} />;
    }
    if (model.type === 'entity') {
      return <Entity.Link entity={value} icon />;
    }
    if (model.type === 'date') {
      return <Date value={value} />;
    }
    return value;
  }
}

class Name extends PureComponent {
  render() {
    const { name, model } = this.props;
    return (<span>{model.label || name}</span>);
  }
}

class Reverse extends Component {
  render() {
    const { model, schemata } = this.props;
    if (!model.schema || !model.reverse) {
      return <FormattedMessage id="property.inverse" defaultMessage="'{name}' of …" values={model} />
    }
    const range = schemata[model.schema],
          prop = range.properties[model.reverse];
    return <span>{prop.plural || prop.name}</span>;
  }
}

class Values extends PureComponent {
  render() {
    const { values, model } = this.props;
    const vals = ensureArray(values).map((value, idx) => (
      <Value key={idx} model={model} value={value} />
    ));
    if (!vals.length) {
      return (<span className='no-value'>—</span>);
    }
    return (<span>{ wordList(vals, ' · ') }</span>);
  }
}

const mapStateToProps = state => ({
  schemata: selectMetadata(state).schemata,
});

class Property extends Component {
    static Name = Name;
    static Reverse = connect(mapStateToProps)(Reverse);
    static Value = Value;
    static Values = Values;
}

export default Property;
