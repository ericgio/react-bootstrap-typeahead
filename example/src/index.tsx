import React from 'react';
import { render } from 'react-dom';

import Page from './components/Page';

import AsyncSection from './sections/AsyncSection';
import BasicSection from './sections/BasicSection';
import BehaviorsSection from './sections/BehaviorsSection';
import CustomSelectionsSection from './sections/CustomSelectionsSection';
import FilteringSection from './sections/FilteringSection';
import PublicMethodsSection from './sections/PublicMethodsSection';
import RenderingSection from './sections/RenderingSection';

import '../../styles/Typeahead.scss';
import '../../styles/Typeahead.bs5.scss';

render(
  <React.StrictMode>
    <Page>
      <BasicSection title="Basic Example" />
      <BehaviorsSection title="Behaviors" />
      <RenderingSection title="Rendering" />
      <FilteringSection title="Filtering" />
      <CustomSelectionsSection title="Custom Selections" />
      <AsyncSection title="Asynchronous Searching" />
      <PublicMethodsSection title="Public Methods" />
    </Page>
  </React.StrictMode>,
  document.getElementById('root')
);
