// @flow

import React, { useEffect } from "react";
import { hot } from "react-hot-loader/root";
import { useLocation } from "@reach/router";

import difference from "lodash/difference";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";

import {
  getAccessToken,
  getFriendsInfo,
  getTokenAndVerifier,
} from "../../utils/";

import { Header } from "../index";
import { Following } from "./components";

import "./styles.scss";

type Props = {
  access: Object,
  friends: Array<number>,
  token: string,
  username: string,
};

const Dashboard = (props: Props) => {
  const { access, friends, username } = props;

  const location = useLocation(); // to allow useLocation() in useEffect()

  useEffect(() => {
    const SEARCH_PARAMS = new URLSearchParams(location.search);
    const { token, verifier } = getTokenAndVerifier(SEARCH_PARAMS);
    // access token
    if (token && verifier && !username) {
      getAccessToken(token, verifier);
    }
    // friends information
    if (friends.data && !friends.data.length) {
      getFriendsInfo(username, friends.ids);
    }
  }, [friends.data, friends.ids, location, username]);

  const renderComponent = () => {
    switch (true) {
      case friends.data && !friends.data.length:
        return (
          <div className="Following--loading">
            <div className="Following__icon">
              <FontAwesomeIcon icon={faSync} size="2x" />
            </div>
            <div className="Following__text">
              <p>Analysing your Twitter Following list...</p>
              <p>
                (this might take a while depending on how many accounts you
                follow)
              </p>
            </div>
          </div>
        );
      default:
        // ids that are from suspended accounts and don't return any information
        const SUSPENDED = difference(
          friends.ids,
          friends.data.map((item) => item.id)
        );

        return (
          <Following
            access={access}
            friends={friends.data}
            suspended={SUSPENDED}
          />
        );
    }
  };

  return (
    <div className="Dashboard">
      <Header />
      {renderComponent()}
    </div>
  );
};

export default hot(Dashboard);
