import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import c from 'classnames';
import { HotkeysTarget, Hotkeys, Hotkey } from '@blueprintjs/core';

import AuthenticationDialog from 'src/dialogs/AuthenticationDialog/AuthenticationDialog';
import PreviewManager from 'src/components/Preview/PreviewManager';
import Navbar from 'src/components/Navbar/Navbar';
import Footer from 'src/components/Footer/Footer';
import { selectSession, selectMetadata } from 'src/selectors';

import './Screen.scss';

class Screen extends React.Component {
  constructor(props) {
    super(props);
    this.toggleAuthentication = this.toggleAuthentication.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location && (this.props.location.pathname !== prevProps.location.pathname)) {
      window.scrollTo(0, 0);
    }
  }

  toggleAuthentication(event) {
    event.preventDefault()
  }

  focusSearchBox(){
    const searchBox = document.querySelector('#search-box');
    if(searchBox){
      searchBox.focus();
    }
  }

  render() {
    const { isHomepage, requireSession, title, className } = this.props;
    const { session, metadata, query, updateQuery } = this.props;
    const forceAuth = requireSession && !session.loggedIn;
    const mainClass = isHomepage ? 'main-homepage' : 'main';

    return (
      <div className={c('Screen', className)}>
        <Helmet titleTemplate={`%s - ${metadata.app.title}`}>
          <title>{title || metadata.app.title}</title>
          <link rel='shortcut icon' href={metadata.app.favicon} />
        </Helmet>
        <Navbar metadata={metadata}
                session={session}
                query={query}
                updateQuery={updateQuery}
                isHomepage={isHomepage} />
        {!forceAuth && (
          <React.Fragment>
            <main className={mainClass}>
              {this.props.children}
            </main>
            <PreviewManager />
          </React.Fragment>
        )}
        {forceAuth && (
          <AuthenticationDialog auth={metadata.auth}
                                isOpen={true}
                                toggleDialog={this.toggleAuthentication} />
        )}
        <Footer isHomepage={isHomepage}
                metadata={metadata}/>
      </div>
    )
  }
  renderHotkeys(){
    const { hotKeys = [] } = this.props;
    return <Hotkeys>
      <Hotkey combo="/" label="Search" global onKeyUp={this.focusSearchBox}/>
      {hotKeys.map(hotKey => <Hotkey
        key={hotKey.combo + hotKey.group}
        {...hotKey}
      />)}
    </Hotkeys>
  }
}

const mapStateToProps = (state) => {
  return {
    metadata: selectMetadata(state),
    session: selectSession(state)
  };
};
Screen = HotkeysTarget(Screen);
Screen = connect(mapStateToProps)(Screen);
Screen = withRouter(Screen);
export default Screen;
