import React, { Component } from 'react';
import styled from 'react-emotion';
import { Redirect, withRouter } from 'react-router';
import WAL, { WalletProvider, Wallet, DiscoveryAccount, DiscoveryData } from 'eos-transit';
import { CloseButton } from '../shared/buttons/CloseButton';
import { LoginButton } from './LoginButton';
import { LoginScreenWalletList } from './LoginScreenWalletList';

// Visual components

const LoginScreenRoot = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  paddingBottom: 100
});

const ContentPanelHeader = styled('div')({
  display: 'flex',
  width: '100%',
  marginBottom: 15
});

interface ContentPanelHeaderItemProps {
  main?: boolean;
  alignEnd?: boolean;
}

const ContentPanelHeaderItem = styled('div')(
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  ({ main, alignEnd }: ContentPanelHeaderItemProps) => {
    const style = {};

    if (main) {
      Object.assign(style, { flex: 1 });
    }

    if (alignEnd) {
      Object.assign(style, { justifyContent: 'flex-end' });
    }

    return style;
  }
);

const ContentPanelHeading = styled('span')({
  fontSize: 12,
  textTransform: 'uppercase',
  fontWeight: 300
});

// Exported components

export interface LoginScreenState {
  showLoginOptions: boolean;
}

export class LoginScreen extends Component<any, LoginScreenState> {
  state = {
    showLoginOptions: false
  };

  switchScreen = () => {
    this.setState(state => ({ showLoginOptions: !state.showLoginOptions }));
  };

  handleWalletProviderSelect = (walletProvider: WalletProvider) => {
    const wallet = WAL.accessContext.initWallet(walletProvider);
    // wallet.connect().then(wallet.discover().then(wallet.login));
    
    
    wallet.connect().then(() => {

      const start1 = window.performance.now();
      wallet.discover({ pathIndexList: [ 0,1,2,3,4,5 ]  }).then((discoveryData2: DiscoveryData) => {
        const end1 = window.performance.now();
        const time1 = end1 - start1;
        console.log(time1);    

        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        
        const start2 = window.performance.now();
        wallet.discover({ pathIndexList: [ 0,1,2,3,4,5,35 ] }).then((discoveryData: DiscoveryData) => {
          const end2 = window.performance.now();
          const time2 = end2 - start2;
          console.log(time2);    
  
          if (discoveryData.keyToAccountMap.length > 0) {
            // console.log(discoveryData.keyToAccountMap.length + ' keys returned, pick one');
            const index = 0;
            const keyObj = discoveryData.keyToAccountMap[index];
  
            const accountName = keyObj.accounts[0].account;
            const authorization = keyObj.accounts[0].authorization;
  
            wallet.login(accountName, authorization);
          } else {
            // 0 keys returned, we need to user to select an account
            wallet.login();
          }
        });
      }); 
    });
  };

  handleWalletReconnectClick = (wallet: Wallet) => {
    wallet.connect().then(wallet.login);
  };

  isLoggedIn = () => !!WAL.accessContext.getActiveWallets().length;

  render() {
    const {
      switchScreen,
      handleWalletProviderSelect,
      handleWalletReconnectClick,
      isLoggedIn
    } = this;
    const { showLoginOptions } = this.state;
    const { getWallets, getWalletProviders } = WAL.accessContext;

    if (isLoggedIn()) return <Redirect to="/" />;

    return (
      
      <LoginScreenRoot>
        {showLoginOptions ? (
          <>
            <ContentPanelHeader>
              <ContentPanelHeaderItem main={true}>
                <ContentPanelHeading>Login Options</ContentPanelHeading>
              </ContentPanelHeaderItem>
              <ContentPanelHeaderItem alignEnd={true}>
                <CloseButton onClick={switchScreen} size={40} />
              </ContentPanelHeaderItem>
            </ContentPanelHeader>
            <LoginScreenWalletList
              walletProviders={getWalletProviders()}
              wallets={getWallets()}
              onWalletProviderSelect={handleWalletProviderSelect}
              onWalletReconnectClick={handleWalletReconnectClick}
            />
          </>
        ) : (
          <LoginButton onClick={switchScreen} />
        )}
      </LoginScreenRoot>
    );
  }
}

export default withRouter(LoginScreen);
