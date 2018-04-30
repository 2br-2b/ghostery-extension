/**
 * Ghostery Rewards
 *
 * This file injects Ghostery Rewards
 *
 * Ghostery Browser Extension
 * https://www.ghostery.com/
 *
 * Copyright 2018 Ghostery, Inc. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0
 */
/**
 * @namespace RewardsContentScript
 */
/* eslint no-use-before-define: 0 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router-dom';
import history from '../../panel/utils/history';
import HotDog from './HotDog';
import OfferCard from './OfferCard';
import globals from '../../../src/classes/Globals';
import ShadowDOM from 'react-shadow';

const { BROWSER_INFO, onMessage } = globals;
const viewport = document.getElementById('viewport');
const channelsSupported = (typeof chrome.runtime.connect === 'function');

class RewardsApp {
	constructor() {
		this.rewardsContainer = document.createElement('div');
		this.rewardsApp = document.createElement('div');
		this.rewardsIframe = null;;
		this.iframeStyle = null;;
		this.port = null;
		this.mainView = null;
		this.rewardsApp.id = 'ghostery-rewards-app';
		this.rewardsApp.className = 'show';
		this.handleMessages = this.handleMessages.bind(this);

		this.init();
	}

	init() {
		if (document.readyState === "complete"
		|| document.readyState === "loaded"
		|| document.readyState === "interactive"
		) {
			this.start()
		} else {
			document.addEventListener('DOMContentLoaded', (event) => {
				this.start();
			})
		}
	}

	start() {
		if (BROWSER_INFO.name === 'chrome') {
			this.renderShadow();
		} else {
			// use iframe to encapsulate CSS - fallback for everything else besides chrome
			this.renderIframe();
		};
	}

	renderReact() {
		let MainView = this.mainView;
		ReactDOM.render(<MainView reward={this.reward} />, this.rewardsApp);
	}

	renderShadow() {
		// use shadowDOM to encapsulate CSS - fully supported in Chrome
		this.rewardsContainer.appendChild(this.rewardsApp);
		document.body.appendChild(this.rewardsContainer);
		this.mainView = (props) => {
			return (
				<Router history={history}>
					<ShadowDOM include={[chrome.extension.getURL('dist/css/rewards_styles.css')]}>
						<div id="ghostery-shadow-root">
							<Route exact path="/" render={ ()=> <HotDog reward={props.reward} /> } />
							<Route path="/hotdog" render={ ()=> <HotDog reward={props.reward} /> } />
							<Route path="/offercard" render={ ()=> <OfferCard reward={props.reward} port={this.port} /> } />
						</div>
					</ShadowDOM>
				</Router>
			);
		}
		this.renderReact();
		this.initListener();
	}

	renderIframe() {
		this.rewardsIframe = document.createElement('iframe');
		this.rewardsIframe.id = 'ghostery-iframe-container';
		this.rewardsIframe.classList.add('hot-dog')
		document.body.appendChild(this.rewardsIframe);
		this.rewardsIframe.onload = () => {
			this.iframeStyle = document.createElement('link');
			this.iframeStyle.rel = 'stylesheet';
			this.iframeStyle.type = 'text/css';
			this.iframeStyle.href = chrome.extension.getURL('dist/css/rewards_styles.css');

			this.rewardsIframe.contentWindow.document.head.appendChild(this.iframeStyle);
			this.rewardsContainer = this.rewardsIframe.contentWindow.document.body;

			this.rewardsApp.classList.add('iframe-child');
			this.rewardsContainer.appendChild(this.rewardsApp);
			this.mainView = (props) => {
				return (
					<Router history={history}>
						<div>
							<Route exact path="/" render={ ()=> <HotDog reward={props.reward} /> } />
							<Route path="/hotdog" render={ ()=> <HotDog reward={props.reward} /> } />
							<Route path="/offercard" render={ ()=> <OfferCard reward={props.reward} port={this.port} /> } />
						</div>
					</Router>
				);
			}
			this.renderReact();
			this.initListener();
		}
	}

	initListener() {
		if (channelsSupported) {
			this.port = chrome.runtime.connect({ name: 'rewardsPort' });
			if (this.port) {
				this.port.onMessage.addListener(this.handleMessages);
				this.port.postMessage({ name: 'rewardsLoaded' });
			}
		} else {
			// TODO listen for this in background.js
			sendMesage('rewardsLoaded');
			onMessage.addListener(this.handleMessages);
		}
	}

	handleMessages(request, sender, response) {
		console.log('handleMessages postMessage request', request);
		if (request.name === 'showHotDog') {
			console.log('showHotDog event reward id ', request.reward.offer_id);
			this.reward = request.reward;
		}
		console.log(document.readyState);
		if (document.readyState === 'complete' || document.readyState === 'interactive') {
			console.log('re render root react');
			this.renderReact();
		}
	}

}

new RewardsApp();