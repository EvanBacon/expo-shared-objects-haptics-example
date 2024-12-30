// import { StatusBar } from "expo-status-bar";
// import { StyleSheet, Text, View } from "react-native";

// import MyModule, { HapticEngine } from "./modules/my-module";
// import { useEffect, useRef } from "react";

// import {
//   AppState,
//   Dimensions,
//   ScrollView,
//   ScrollViewProps,
//   Easing,
// } from "react-native";

// function useEngine() {
//   const ref = useRef<HapticEngine | null>(null);
//   useEffect(() => {
//     ref.current = new MyModule.HapticEngine();
//     ref.current.start();

//     // The engine must be recreated when the app resumes.
//     const off = AppState.addEventListener("change", (state) => {
//       if (state === "active") {
//         ref.current.start();
//       } else if (state === "background") {
//         ref.current.stop();
//       }
//     });

//     return () => {
//       off.remove();
//       ref.current.stop();
//     };
//   }, []);

//   return ref;
// }

// export default function App() {
//   const engine = useEngine();

//   return (
//     <View style={styles.container}>
//       <Text
//         onPress={async () => {
//           //  let pattern = try CHHapticPattern(events: [event], parameters: [])
//           engine.current.playPattern({
//             events: [
//               // let event = CHHapticEvent(eventType: .hapticTransient, parameters: [intensityParameter, sharpnessParameter], relativeTime: 0)
//               {
//                 eventType: "HapticTransient",
//                 parameters: [
//                   {
//                     parameterID: MyModule.HapticParameters.hapticIntensity,
//                     value: 1,
//                   },
//                   {
//                     parameterID: MyModule.HapticParameters.hapticSharpness,
//                     value: 1,
//                   },
//                 ],
//                 relativeTime: 0,
//               },
//             ],
//             parameters: [],
//           });
//         }}
//       >
//         Open up App.js to start working on your app!
//       </Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ArcScrollView } from "./ArcScroll";

export default function App() {
  const [refreshing, setRefreshing] = useState(false);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ArcScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 500);
            }}
          />
        }
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <View style={styles.container}>
          <Text style={{ fontSize: 16 }}>Pull to refresh ↓</Text>
          <StatusBar style="auto" />
        </View>
      </ArcScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
