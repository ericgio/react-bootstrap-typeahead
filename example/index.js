'use strict';

import React from 'react';
import {render} from 'react-dom';

import Page from './components/Page.react';

import AsyncSection from './sections/AsyncSection.react';
import BasicSection from './sections/BasicSection.react';
import BehaviorsSection from './sections/BehaviorsSection.react';
import CustomSelectionsSection from './sections/CustomSelectionsSection.react';
import FilteringSection from './sections/FilteringSection.react';
import PublicMethodsSection from './sections/PublicMethodsSection.react';
import RenderingSection from './sections/RenderingSection.react';

import '../css/ClearButton.css';
import '../css/Loader.css';
import '../css/Token.css';
import '../css/Typeahead.css';

import './css/bs-docs-override.css';
import './css/example.css';
import './css/code-style.css';

render(
  <Page title="Examples">
    <BasicSection />
    <BehaviorsSection />
    <RenderingSection />
    <FilteringSection />
    <CustomSelectionsSection />
    <AsyncSection />
    <PublicMethodsSection />
  </Page>,
  document.getElementById('root')
);
