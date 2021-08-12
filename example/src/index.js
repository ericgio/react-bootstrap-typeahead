import React from 'react';
import ReactDOM from 'react-dom';

import Page from './components/Page';

import AsyncSection from './sections/AsyncSection';
import BasicSection from './sections/BasicSection';
import BehaviorsSection from './sections/BehaviorsSection';
import CustomSelectionsSection from './sections/CustomSelectionsSection';
import FilteringSection from './sections/FilteringSection';
import PublicMethodsSection from './sections/PublicMethodsSection';
import RenderingSection from './sections/RenderingSection';
import FloatingLabelSection from "./sections/FloatingLabelSection";

import '../../styles/Typeahead.scss';

ReactDOM.render(
  <React.StrictMode>
    <Page>
      <BasicSection />
        <FloatingLabelSection/>
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
