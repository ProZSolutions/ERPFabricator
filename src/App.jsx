import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigations from "./screens/navigations/Navigations";
import { AuthProvider } from "./component/AuthContext/AuthContext";

function App() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <Navigations />
            </AuthProvider>
        </SafeAreaProvider>
    );
}

export default App;
