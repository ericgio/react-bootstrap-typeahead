import React, { Children, useState } from 'react';
import { Col, Container, Nav, Row } from 'react-bootstrap';

import ExampleContext from './Context';
import PageFooter from './PageFooter';
import PageHeader from './PageHeader';
import PageMenu from './PageMenu';

import getIdFromTitle from '../util/getIdFromTitle';

type SectionComponent = React.ComponentType<{ title: string }>;

interface PageProps {
  children: SectionComponent[];
}

const Page = ({ children }: PageProps) => {
  const [activeHref, setActiveHref] = useState(window.location.hash);

  const hrefs: string[] = [];
  const sections: string[] = [];

  Children.forEach(children, (child) => {
    // @ts-ignore
    const { title } = child.props;
    hrefs.push(`#${getIdFromTitle(title)}`);
    sections.push(title);
  });

  const handleMenuItemClick = (href: string) => {
    window.location.hash = href;
    setActiveHref(href);
  };

  const onAfter = (href: string) => setActiveHref(href);

  const onBefore = (href: string) => {
    const index = hrefs.indexOf(href) - 1;
    setActiveHref(hrefs[index]);
  };

  return (
    <ExampleContext.Provider value={{ onAfter, onBefore }}>
      <div className="bs-docs-page">
        <PageHeader />
        <Container as="main" fluid="md">
          <Row>
            <Col md={9}>{children}</Col>
            <Col md={3}>
              <PageMenu>
                {sections.map((title: string) => {
                  const href = `#${getIdFromTitle(title)}`;
                  return (
                    <Nav.Item key={href}>
                      <Nav.Link
                        active={href === activeHref}
                        onClick={() => handleMenuItemClick(href)}>
                        {title}
                      </Nav.Link>
                    </Nav.Item>
                  );
                })}
              </PageMenu>
            </Col>
          </Row>
        </Container>
        <PageFooter />
      </div>
    </ExampleContext.Provider>
  );
};

export default Page;
