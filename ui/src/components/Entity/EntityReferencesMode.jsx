import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Waypoint from 'react-waypoint';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';

import Query from 'src/app/Query';
import Fragment from 'src/app/Fragment';
import { queryEntities } from 'src/actions/index';
import { selectEntityReference, selectEntitiesResult, selectSchemata } from "src/selectors";
import { SectionLoading, ErrorSection, Property } from 'src/components/common';
import ensureArray from 'src/util/ensureArray';

const messages = defineMessages({
  no_relationships: {
    id: 'entity.references.no_relationships',
    defaultMessage: 'This entity does not have any relationships.',
  }
});


class EntityReferencesMode extends React.Component {
  constructor(props) {
    super(props);
    this.getMoreResults = this.getMoreResults.bind(this);
  }

  componentDidMount() {
    this.fetchIfNeeded();
  }

  componentDidUpdate(prevProps) {
    this.fetchIfNeeded();
  }

  fetchIfNeeded() {
    const { reference, query, result } = this.props;
    if (reference && result.shouldLoad) {
      this.props.queryEntities({ query });
    }
  }

  getMoreResults() {
    const { query, result } = this.props;
    if (result && !result.isLoading && result.next && !result.isError) {
      this.props.queryEntities({ query, next: result.next });
    }
  }

  onShowDetails(entity) {
    const { history } = this.props;
    return (event) => {
      event.preventDefault();
      const fragment = new Fragment(history);
      if(fragment.state['preview:id'] === entity.id && fragment.state['preview:type'] === 'entity') {
        fragment.update({
          'preview:id': undefined,
          'preview:type': undefined,
          'preview:mode': undefined,
        });
      } else {
        fragment.update({
          'preview:mode': 'info',
          'preview:type': 'entity',
          'preview:id': entity.id
        });
      }
    }
  }

  render() {
    const { intl, reference, result, model } = this.props;
    if (!reference) {
      return <ErrorSection visual="graph" title={intl.formatMessage(messages.no_relationships)} />;
    }
    const { property } = reference;
    const results = ensureArray(result.results);
    const columns = _.map(model.featured, (name) => {
      return model.properties[name];
    }).filter((prop) => {
      return prop.name !== property.name && !prop.caption;
    });

    return (
      <section key={property.qname} className="EntityReferencesTable">
        <table key={property.qname} className="data-table references-data-table">
          <thead>
            <tr key={property.qname}>
              {columns.map(prop => (
                <th key={prop.name} className={prop.type}>
                  <Property.Name model={prop} />
                </th>
              ))}
              <th key="details" className="narrow"/>
            </tr>
          </thead>
          <tbody>
            {results.map((entity) => (
              <tr key={entity.id}>
                {columns.map(prop => (
                  <td key={prop.name} className={prop.type}>
                    <Property.Values model={prop} values={entity.properties[prop.name]} />
                  </td>
                ))}
                <td key="details" className="narrow">
                  <a onClick={this.onShowDetails(entity)}>
                    <span>
                      <FormattedMessage id="references.details" defaultMessage="Details" />
                    </span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Waypoint onEnter={this.getMoreResults}
                  bottomOffset="-300px"
                  scrollableAncestor={window} />
        { result.isLoading && (
          <SectionLoading />
        )}
      </section>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { entity, mode, location } = ownProps;
  const reference = selectEntityReference(state, entity.id, mode);
  if (!reference) {
    return {};
  }
  const context = {
    [`filter:properties.${reference.property.name}`]: entity.id
  };
  const query = Query.fromLocation('search', location, context, reference.property.name);
  return {
    reference, query,
    result: selectEntitiesResult(state, query),
    model: selectSchemata(state)[reference.schema]
  };
};

EntityReferencesMode = connect(mapStateToProps, { queryEntities })(EntityReferencesMode);
EntityReferencesMode = withRouter(EntityReferencesMode);
EntityReferencesMode = injectIntl(EntityReferencesMode);
export default EntityReferencesMode;