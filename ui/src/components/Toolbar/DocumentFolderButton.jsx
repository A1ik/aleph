import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from '@blueprintjs/core';

import DocumentFolderDialog from "src/dialogs/DocumentFolderDialog/DocumentFolderDialog";

class DocumentFolderButton extends React.Component {
  constructor() {
    super();
    this.state = {
      isFolderOpen: false
    };

    this.toggleFolder = this.toggleFolder.bind(this);
  }

  toggleFolder() {
    this.setState({isFolderOpen: !this.state.isFolderOpen})
  }

  render() {
    const { collection, parent } = this.props;
    const parentFolder = parent == null ? true : parent.schema === 'Folder';

    if (!parentFolder || !collection.writeable || !collection.casefile) {
      return null;
    }

    return (
      <React.Fragment>
        <Button onClick={this.toggleFolder} icon="folder-new">
          <FormattedMessage id="document.folder.button" defaultMessage="New folder"/>
        </Button>
        <DocumentFolderDialog collection={collection}
                              parent={parent}
                              isOpen={this.state.isFolderOpen}
                              toggleDialog={this.toggleFolder} />
      </React.Fragment>
    );
  }
}

export default DocumentFolderButton;