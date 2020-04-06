import React from 'react';
import ReactDOM from 'react-dom';

import Page from './components/Page.react';

import AsyncSection from './sections/AsyncSection.react';
import BasicSection from './sections/BasicSection.react';
import BehaviorsSection from './sections/BehaviorsSection.react';
import CustomSelectionsSection from './sections/CustomSelectionsSection.react';
import FilteringSection from './sections/FilteringSection.react';
import PublicMethodsSection from './sections/PublicMethodsSection.react';
import RenderingSection from './sections/RenderingSection.react';

import '../../styles/Typeahead.scss';

ReactDOM.render(
  <React.StrictMode>
    <Page>
      <BasicSection />
      <BehaviorsSection />
      <RenderingSection />
      <FilteringSection />
      <CustomSelectionsSection />
      <AsyncSection />
      <PublicMethodsSection />
    </Page>
  </React.StrictMode>,
  document.getElementById('root')
);
