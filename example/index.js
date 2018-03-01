'use strict';

import React from 'react';
import {render} from 'react-dom';

import Page from './components/Page';

import AsyncSection from './sections/AsyncSection';
import BasicSection from './sections/BasicSection';
import BehaviorsSection from './sections/BehaviorsSection';
import CustomSelectionsSection from './sections/CustomSelectionsSection';
import FilteringSection from './sections/FilteringSection';
import PublicMethodsSection from './sections/PublicMethodsSection';
import RenderingSection from './sections/RenderingSection';

import '../css/Typeahead.css';

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
