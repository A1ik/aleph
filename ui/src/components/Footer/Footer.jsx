import React from 'react';
import {FormattedMessage} from 'react-intl';
import { Icon } from '@blueprintjs/core';

import './Footer.scss';

class Footer extends React.Component {

  render() {
    const {metadata} = this.props;

    return (
      <footer id="Footer" className="Footer">
        <div className="info">
          <strong>ℵ</strong>
          {' '}
          <FormattedMessage id='footer.aleph'
                            defaultMessage="aleph {version}"
                            values={{
                                version: metadata.app.version
                            }} />
          <span className="bp3-text-muted"> • </span>
          <span>
            <a href="https://github.com/alephdata/aleph/wiki/User-manual">
              <Icon icon="help" iconSize={14} />
            </a>
            {' '}
            <a href="https://github.com/alephdata/aleph/wiki/User-manual">
                <FormattedMessage id='footer.help'
                                  defaultMessage="Help"/>
            </a>
          </span>
          <span className="bp3-text-muted"> • </span>
          <span>
            <a href="https://github.com/alephdata/aleph">
              <Icon icon="git-repo" iconSize={14} />
            </a>
            {' '}
            <a href="https://github.com/alephdata/aleph">
              <FormattedMessage id='footer.code'
                                defaultMessage="Code"/>
            </a>
          </span>
        </div>
      </footer>
    );
  }
}

export default Footer;