import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { Category, Country, Role, Date, Collection, URL } from 'src/components/common';

import './CollectionOverview.scss';

class CollectionOverview extends Component {
  render() {
    const { collection, hasHeader = false } = this.props;
    if (!collection) {
      return null;
    }



    return (
      <div className='CollectionOverview'>
        {hasHeader && (
          <h4>
            <Collection.Link collection={collection} />
          </h4>
        )}
        <p>{collection.summary}</p>
        <ul className='info-sheet'>
          { !collection.casefile && (
            <li>
              <span className="key">
                <FormattedMessage id="collection.category" defaultMessage="Category"/>
              </span>
              <span className="value">
                <Category collection={collection} />
              </span>
            </li>
          )}
          { (collection.publisher || collection.publisher_url) && (
            <li>
              <span className="key">
                <FormattedMessage id="collection.publisher" defaultMessage="Publisher"/>
              </span>
              <span className="value">
                { !collection.publisher && (
                  <URL value={collection.publisher_url} />
                )}
                { !collection.publisher_url && (
                  <span>{collection.publisher}</span>
                )}
                { (collection.publisher && collection.publisher_url) && (
                  <a href={collection.publisher_url} target="_blank">
                    {collection.publisher}
                  </a>
                )} 
              </span>
            </li>
          )}
          { collection.info_url && (
            <li>
              <span className="key">
                <FormattedMessage id="collection.info_url" defaultMessage="Information URL"/>
              </span>
              <span className="value">
                <URL value={collection.info_url} />
              </span>
            </li>
          )}
          { collection.data_url && (
            <li>
              <span className="key">
                <FormattedMessage id="collection.data_url" defaultMessage="Data URL"/>
              </span>
              <span className="value">
                <URL value={collection.data_url} />
              </span>
            </li>
          )}
          { collection.creator && (
            <li>
              <span className="key">
                <FormattedMessage id="collection.creator" defaultMessage="Manager"/>
              </span>
              <span className="value">
                <Role.Link role={collection.creator} />
              </span>
            </li>
          )}
          { collection.team.length > 1 && (
            <li>
              <span className="key">
                <FormattedMessage id="collection.team" defaultMessage="Accessible to"/>
              </span>
              <span className="value">
                <Role.List roles={collection.team} />
              </span>
            </li>
          )}
          { collection.countries && !!collection.countries.length && (
            <li>
              <span className="key">
                <FormattedMessage id="collection.countries" defaultMessage="Country"/>
              </span>
              <span className="value">
                <Country.List codes={collection.countries} />
              </span>
            </li>
          )}
          <li>
            <span className="key">
              <FormattedMessage id="collection.updated_at" defaultMessage="Last updated"/>
            </span>
            <span className="value">
              <Date value={collection.updated_at} />
            </span>
          </li>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {};
};

CollectionOverview = connect(mapStateToProps)(CollectionOverview);

export default CollectionOverview;
