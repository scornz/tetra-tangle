import { Global } from "@emotion/react";

export const Fonts = () => (
  <Global
    styles={`

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

      @font-face {
        font-family: 'Ostrich Sans Inline';
        font-style: italic;
        font-weight: 400;
        font-display: swap;
        src: url(./fonts/ostrich-sans-inline-italic-400.otf) format('opentype');
      }

    `}
  />
);
