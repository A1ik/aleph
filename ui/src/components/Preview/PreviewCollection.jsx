import React from 'react';
import { connect } from 'react-redux';

import CollectionContextLoader from 'src/components/Collection/CollectionContextLoader';
import CollectionToolbar from 'src/components/Collection/CollectionToolbar';
import CollectionHeading from 'src/components/Collection/CollectionHeading';
import CollectionViews from 'src/components/Collection/CollectionViews';
import { DualPane, SectionLoading, ErrorSection } from 'src/components/common';
import Preview from 'src/components/Preview/Preview';
import { selectCollection } from 'src/selectors';


class PreviewCollection extends React.Component {
  render() {
    const { previewId } = this.props;
    return (
      <CollectionContextLoader collectionId={previewId}>
        <Preview maximised={true}>
          <DualPane.InfoPane className="with-heading">
            {this.renderContext()}
          </DualPane.InfoPane>
        </Preview>
      </CollectionContextLoader>
    );
  }

  renderContext() {
    const { collection, previewMode = 'info' } = this.props;
    if (collection.isError) {
      return <ErrorSection error={collection.error} />
    }
    if (collection.shouldLoad || collection.isLoading) {
      return <SectionLoading/>;
    }
    return (
      <React.Fragment>
        <CollectionToolbar collection={collection}
                           isPreview={true} />
        <CollectionHeading collection={collection}/>
        <CollectionViews collection={collection}
                         activeMode={previewMode}
                         isPreview={true} />
      </React.Fragment>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    collection: selectCollection(state, ownProps.previewId)
  };
};

PreviewCollection = connect(mapStateToProps, {})(PreviewCollection);
export default PreviewCollection;