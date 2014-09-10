/**
 * Created with IntelliJ IDEA.
 * User: Todd Kerpelman
 * Date: 10/15/12
 * Time: 8:52 AM
 * All game constants have been moved here, for ease of setting up your own
 * application
 *
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";

var constants = constants || {};

constants.ACH_PRIME = 'CgkIypzL1IsSEAIQAw';
constants.ACH_BORED = 'CgkIypzL1IsSEAIQBA';
constants.ACH_HUMBLE = 'CgkIypzL1IsSEAIQBQ';
constants.ACH_COCKY = 'CgkIypzL1IsSEAIQBg';
constants.ACH_UBER = 'CgkIypzL1IsSEAIQBw';
constants.ACH_REALLY_BORED = 'CgkIypzL1IsSEAIQCA';
constants.LEAD_EASY = 'CgkIypzL1IsSEAIQCQ';
constants.LEAD_HARD = 'CgkIypzL1IsSEAIQCg';

constants.CLIENT_ID = 
  '621605473866-f3qalqomqeurgep8pogku06t2in9qvvg.apps.googleusercontent.com';

constants.LINK_PAGE_BASE = 
  'https://101-dot-vivid-lambda-561.appspot.com/linkPage/index.php';

/**
 * Scopes used by the application.
 * @type {string}
 */
constants.SCOPES =
    'https://www.googleapis.com/auth/userinfo.email ' +
    'https://www.googleapis.com/auth/plus.login ' + 
    'https://www.googleapis.com/auth/games';
