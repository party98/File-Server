import React from "react";

import ContentSpacer from "../widget/content-spacer";
import SubTitle from '../widget/sub-title';
import InfoPane from '../widget/info-pane';
import ClientInfo from '../widget/client-info';
import Img from 'react-image'
import TitleBar from '../widget/title-bar';

import fetch from 'isomorphic-fetch';

import {cls, constants} from "../util/"

export default class HomePage extends React.Component {

    constructor(props) {
        super(props);
        this.interval = null;
        this.state = {
            error: null,
            isLoaded: false,
            clients: []
        };
    }

    fetchData() {
        fetch("/api/activeclients", {
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, same-origin, *omit
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            redirect: 'follow', // *manual, follow, error
            referrer: 'no-referrer', // *client, no-referrer
        })
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    clients: result
                });
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )
    }

    tick(self) {
        var refresh_rate = 1000

        if (this.props.user != null) {
            refresh_rate = this.props.user.refresh_rate;
        }
        
        self.fetchData()
        if (self.interval == null) {
            self.interval = setInterval((function(self) {         //Self-executing func which takes 'this' as self
                return function() {   //Return a function in the context of 'self'
                    self.tick(self); //Thing you wanted to run as non-window 'this'
                }
            })(self), refresh_rate);
        }
    }

    componentDidMount() {
        this.tick(this);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {

        var client_elements = []

        for (var i = 0; i < this.state.clients.length; i++) {
            var element = (
                <ContentSpacer key={i}>
                    <center>
                        <ClientInfo info={this.state.clients[i]} user={this.props.user}></ClientInfo>
                    </center>
                </ContentSpacer>
            );

            client_elements.push(element);
        }

        return (
            <div>
                <TitleBar selectedIndex={[0]} user={this.props.user}> </TitleBar>
                <InfoPane title="Active Clients" size="large">
                    {client_elements}
                </InfoPane>
            </div>
        );
    }
};