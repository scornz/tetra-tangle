import { Global } from "@emotion/react";

const Fonts = () => (
  <Global
    styles={`
      @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');

      @font-face {
        font-family: 'Ostrich Sans';
        font-style: normal;
        font-weight: 300;
        font-display: swap;
        src: url(./fonts/ostrich-sans-300.otf) format('opentype');
      }

      @font-face {
        font-family: 'Ostrich Sans';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url(./fonts/ostrich-sans-400.otf) format('opentype');
      }

      @font-face {
        font-family: 'Ostrich Sans';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url(./fonts/ostrich-sans-700.otf) format('opentype');
      }
    
      @font-face {
        font-family: 'Ostrich Sans Inline';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url(./fonts/ostrich-sans-inline-400.otf) format('opentype');
      }

    `}
  />
);

export default Fonts;
