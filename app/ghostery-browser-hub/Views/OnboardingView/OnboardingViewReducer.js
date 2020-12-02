/**
 * Reducer used throughout the Onboarding View's flow
 *
 * Ghostery Browser Extension
 * https://www.ghostery.com/
 *
 * Copyright 2020 Ghostery, Inc. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0
 */

import {
	SET_AD_BLOCK,
	SET_TRACKER_BLOCKING_POLICY,
	SET_ANTI_TRACKING,
	INIT_ONBOARDING_PROPS,
	SET_ONBOARDING_NAVIGATION,
	SET_SMART_BLOCK,
	SET_HUMAN_WEB
} from './OnboardingViewConstants';

const initialState = {};

function OnboardingViewReducer(state = initialState, action) {
	switch (action.type) {
		case INIT_ONBOARDING_PROPS: {
			const {
				navigation,
				setup_show_warning_override,
				blockingPolicy,
				enable_anti_tracking,
				enable_ad_block,
				enable_smart_block,
				enable_ghostery_rewards,
				enable_human_web,
			} = action.data;
			const {
				activeIndex,
				hrefPrev,
				hrefNext,
				hrefDone,
				textPrev,
				textNext,
				textDone,
			} = navigation;
			return {
				...state,
				setup: {
					navigation: {
						activeIndex,
						hrefPrev,
						hrefNext,
						hrefDone,
						textPrev,
						textNext,
						textDone,
					},
					setup_show_warning_override,
					blockingPolicy,
					enable_anti_tracking,
					enable_ad_block,
					enable_smart_block,
					enable_ghostery_rewards,
					enable_human_web,
				}
			};
		}
		case SET_ONBOARDING_NAVIGATION: {
			const {
				activeIndex,
				hrefPrev,
				hrefNext,
				hrefDone,
				textPrev,
				textNext,
				textDone,
			} = action.data;
			return {
				...state,
				setup: {
					...state.setup,
					navigation: {
						activeIndex,
						hrefPrev,
						hrefNext,
						hrefDone,
						textPrev,
						textNext,
						textDone,
					}
				}
			};
		}

		case SET_AD_BLOCK: {
			const { enable_ad_block } = action.data;
			return { ...state, setup: { ...state.setup, enable_ad_block } };
		}
		case SET_TRACKER_BLOCKING_POLICY: {
			const { blockingPolicy } = action.data;
			return { ...state, setup: { ...state.setup, blockingPolicy } };
		}
		case SET_ANTI_TRACKING: {
			const { enable_anti_tracking } = action.data;
			return { ...state, setup: { ...state.setup, enable_anti_tracking } };
		}
		case SET_SMART_BLOCK: {
			const { enable_smart_block } = action.data;
			return { ...state, setup: { ...state.setup, enable_smart_block } };
		}

		default: return state;
	}
}

export default OnboardingViewReducer;
