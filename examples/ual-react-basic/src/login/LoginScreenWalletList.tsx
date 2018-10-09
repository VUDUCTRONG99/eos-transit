import React, { Component } from 'react';
import styled from 'react-emotion';
import WalletListItem from '../shared/wallets/WalletListItem';
import { WalletProviderInfo, WalletModel } from 'shared/wallets/types';

// Visual components

const LoginScreenWalletListRoot = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginBottom: 4
});

// Exported component

interface LoginScreenWalletListProps {
  wallets: WalletModel[];
  onWalletSelect?: (wallet: WalletModel) => void;
  onWalletReconnectClick?: (wallet: WalletModel) => void;
}

export class LoginScreenWalletList extends Component<
  LoginScreenWalletListProps
> {
  constructor(props: LoginScreenWalletListProps) {
    super(props);
  }

  handleWalletSelect = (wallet: WalletModel) => {
    const { onWalletSelect } = this.props;
    if (typeof onWalletSelect === 'function') {
      onWalletSelect(wallet);
    }
  };

  handleReconnectClick = (wallet: WalletModel) => {
    const { onWalletReconnectClick } = this.props;
    if (typeof onWalletReconnectClick === 'function') {
      onWalletReconnectClick(wallet);
    }
  };

  render() {
    const { handleWalletSelect, handleReconnectClick } = this;
    const { wallets } = this.props;

    return (
      <LoginScreenWalletListRoot>
        {wallets.map(wallet => (
          <WalletListItem
            key={wallet.providerInfo.id}
            onSelect={handleWalletSelect}
            onReconnectClick={handleReconnectClick}
            data={wallet}
            large={true}
            dismissable={false}
          />
        ))}
      </LoginScreenWalletListRoot>
    );
  }
}

export default LoginScreenWalletList;