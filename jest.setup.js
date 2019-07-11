import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

// Mock `document.createRange` which is used by Popper.js
if (global.document) {
  document.createRange = () => ({
    commonAncestorContainer: {
      nodeName: 'BODY',
      ownerDocument: document,
    },
    setEnd: () => {},
    setStart: () => {},
  });
}
