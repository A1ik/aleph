import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { defineMessages, injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import { Icon } from '@blueprintjs/core';

import { Count, ResultCount } from 'components/common';
import { collectionXrefFacetsQuery } from 'queries';
import { selectModel, selectCollectionXrefResult } from 'selectors';

const messages = defineMessages({
  diagrams: {
    id: 'collection.info.diagrams',
    defaultMessage: 'Network diagrams',
  },
  diagrams_description: {
    id: 'collection.info.diagrams_description',
    defaultMessage: 'Network diagrams let you visualize complex relationships within an investigation.',
  },
  lists: {
    id: 'collection.info.lists',
    defaultMessage: 'Lists',
  },
  lists_description: {
    id: 'collection.info.lists_description',
    defaultMessage: 'Lists let you organize and group related entities of interest.',
  },
  xref: {
    id: 'collection.info.xref',
    defaultMessage: 'Cross-reference',
  },
  xref_description: {
    id: 'collection.info.xref_description',
    defaultMessage: 'Cross-referencing allows you to search the rest of Aleph for entities similar to those contained in your investigation.',
  },
  search: {
    id: 'collection.info.search',
    defaultMessage: 'Search',
  },
  documents: {
    id: 'collection.info.browse',
    defaultMessage: 'Documents',
  },
  entities: {
    id: 'collection.info.entities',
    defaultMessage: 'Entities',
  },
  mappings: {
    id: 'collection.info.mappings',
    defaultMessage: 'Entity mappings',
  },
  mappings_description: {
    id: 'collection.info.mappings_description',
    defaultMessage: 'Entity mappings allow you to bulk generate structured Follow the Money entities (like People, Companies, and the relationships among them) from rows in a spreadsheet or CSV document',
  },
  mentions: {
    id: 'collection.info.mentions',
    defaultMessage: 'Mentions',
  },
  mentions_description: {
    id: 'collection.info.mentions_description',
    defaultMessage: 'Aleph automatically extracts terms that resemble names, address, phone numbers, and email addresses from uploaded documents and entities within your investigation. {br}{br} Click on a mentioned term below to find where it appears in your investigation.',
  },
  overview: {
    id: 'collection.info.overview',
    defaultMessage: 'Overview',
  },
});

const icons = {
  overview: 'grouped-bar-chart',
  documents: 'document',
  entities: 'list-columns',
  xref: 'comparison' ,
  diagrams: 'graph' ,
  mappings: 'new-object' ,
  search: 'search' ,
  lists: 'list' ,
  mentions: 'tag' ,
};

const CollectionViewIcon = ({ id, className }) => {
  const icon = icons[id];
  if (!icon) { return null; }
  return <Icon icon={icon} className={className} />
}

class CollectionViewLabel extends PureComponent {
  render() {
    const { icon, id, intl } = this.props;
    if (!id) { return null; }
    const messageKey = messages[id];
    if (!messageKey) { return null; }

    return (
      <>
        {icon && <CollectionViewIcon id={id} className="left-icon" />}
        <span>{intl.formatMessage(messageKey)}</span>
      </>
    );
  }
}

const CollectionViewCount = ({ id, collection, model, xrefResult }) => {
  let count;
  switch(id) {
    case 'documents':
    case 'entities':
      const schemaCounts = collection?.statistics?.schema?.values;
      if (schemaCounts) {
        count = 0;
        Object.entries(schemaCounts).forEach(([key, value]) => {
          const schema = model.getSchema(key);
          if ((id === 'entities' && !schema.isDocument()) || (id === 'documents' && schema.isDocument())) {
            count += value;
          }
        });
      }
      break;
    case 'xref':
      if (xrefResult) {
        return <ResultCount result={xrefResult} />
      }
      break;
    case 'diagrams':
      count = collection?.counts?.entitysets?.diagram;
      break;
    case 'mappings':
      count = collection?.counts?.mappings;
      break;
    case 'lists':
      count = collection?.counts?.entitysets?.list;
      break;
    default:
      return null;
  }

  if (count) {
    return <Count count={count} />;
  } else {
    return <Count count={0} />;
  }
}

class CollectionViewDescription extends PureComponent {
  render() {
    const { id, intl } = this.props;
    if (!id) { return null; }
    const messageKey = messages[`${id}_description`];
    if (!messageKey) { return null; }

    return (
      <span>{intl.formatMessage(messageKey, {br: <br />})}</span>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { collection, location } = ownProps;
  const xrefQuery = collectionXrefFacetsQuery(location, collection.id);

  return ({
    model: selectModel(state),
    xrefResult: selectCollectionXrefResult(state, xrefQuery),
  });
};

export default class CollectionView {
  static Icon = CollectionViewIcon;
  static Label = injectIntl(CollectionViewLabel);
  static Count = compose(withRouter, connect(mapStateToProps))(CollectionViewCount);
  static Description = injectIntl(CollectionViewDescription);
}
