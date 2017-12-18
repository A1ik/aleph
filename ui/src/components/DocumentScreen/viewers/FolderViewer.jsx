import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import WayPoint from 'react-waypoint';
import { Spinner } from '@blueprintjs/core';

import { fetchChildDocs, fetchNextChildDocs } from 'src/actions';
import getPath from 'src/util/getPath';

class DocAsListItem extends Component {
  render() {
    const { document } = this.props;
    return (
      <li>
        <Link to={getPath(document.links.ui)}>
          {document.file_name}
        </Link>
      </li>
    )
  }
}

class FolderViewer extends Component {
  bottomReachedHandler() {
    const { document, childDocsResult, fetchNextChildDocs } = this.props;
    if (childDocsResult.next && !childDocsResult.isFetchingNext) {
      fetchNextChildDocs({
        id: document.id,
        next: childDocsResult.next,
      });
    }
  }

  componentDidMount() {
    this.fetchIfNeeded();
  }

  componentDidUpdate() {
    this.fetchIfNeeded();
  }

  fetchIfNeeded() {
    const { document, childDocsResult } = this.props;
    if (
      !childDocsResult
      || (!childDocsResult.results && !childDocsResult.isFetching)
    ) {
      this.props.fetchChildDocs({ id: document.id });
    }
  }

  render() {
    const { childDocsResult } = this.props;
    return (
      <div className="FolderViewer">
        {childDocsResult && childDocsResult.results &&
          <div>
            <ul>
              {childDocsResult.results.map(childDoc => (
                <DocAsListItem key={childDoc.id} document={childDoc} />
              ))}
            </ul>
            {childDocsResult.next && (
              childDocsResult.isFetchingNext
                ? <Spinner />
                : <WayPoint onEnter={this.bottomReachedHandler.bind(this)} />
            )}
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const childDocIdsResult = state.documentChildrenResults[ownProps.document.id];
  // Denormalise the result, inserting the docs themselves into it.
  const childDocsResult = childDocIdsResult !== undefined
    ? {
      ...childDocIdsResult,
      results: childDocIdsResult.results
        ? childDocIdsResult.results.map(id => state.apiCache[id])
        : undefined,
    }
    : undefined;
  return {
    childDocsResult,
  };
};

const mapDispatchToProps = { fetchChildDocs, fetchNextChildDocs };

export default connect(mapStateToProps, mapDispatchToProps)(FolderViewer);