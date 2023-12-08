import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot, useRecoilValue } from "recoil";
import RecoilNexus from "recoil-nexus";

// State
import { AppState, appStateAtom } from "state/app";

// Generic theming
import { Fonts, theme } from "ui/style";

// All screens
import { Game, Leaderboard, SubmitScore, Home } from "ui/screens";

/**
 * Base provider for app
 */
function App() {
  return (
    <RecoilRoot>
      <RecoilNexus />
      <Fonts />
      <ChakraProvider theme={theme}>
        <Router />
      </ChakraProvider>
    </RecoilRoot>
  );
}

/**
 * Routes to different screens in the app based on the current state
 */
function Router() {
  const state = useRecoilValue(appStateAtom);
  // Switch screen based on current app state
  const render = () => {
    switch (state) {
      case AppState.START:
        return <Home />;
      case AppState.PLAYING:
        return <Game />;
      case AppState.SUBMIT_SCORE:
        return <SubmitScore />;
      case AppState.LEADERBOARD:
        return <Leaderboard />;
    }
  };

  return render();
}

export default App;
