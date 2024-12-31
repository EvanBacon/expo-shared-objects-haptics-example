import { useEffect, useRef } from "react";
import {
  AppState,
  Dimensions,
  ScrollView,
  ScrollViewProps,
  Easing,
} from "react-native";

import MyModule, { HapticEngine } from "./modules/my-module";

function useHapticsEngine() {
  const ref = useRef<HapticEngine | null>(null);
  useEffect(() => {
    ref.current = new MyModule.HapticEngine();
    ref.current.start();

    // The engine must be recreated when the app resumes.
    const off = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        ref.current.start();
      } else if (state === "background") {
        ref.current.stop();
      }
    });

    return () => {
      off.remove();
      ref.current.stop();
    };
  }, []);

  return ref;
}

function playPattern(
  engine: HapticEngine,
  intensity: number,
  sharpness: number
) {
  //  let pattern = try CHHapticPattern(events: [event], parameters: [])
  engine.playPattern({
    events: [
      // let event = CHHapticEvent(eventType: .hapticTransient, parameters: [intensityParameter, sharpnessParameter], relativeTime: 0)
      {
        eventType: MyModule.CHHapticEvent.EventType.hapticTransient,
        parameters: [
          {
            parameterID: MyModule.CHHapticEvent.ParameterID.hapticIntensity,
            value: intensity,
          },
          {
            parameterID: MyModule.CHHapticEvent.ParameterID.hapticSharpness,
            value: sharpness,
          },
        ],
        relativeTime: 0,
      },
    ],
    parameters: [],
  });
}

function playHaptic(engine: HapticEngine, intensity: number) {
  if (!engine) return;
  if (intensity >= 1) {
    playPattern(engine, 1, 1);
  } else {
    playPattern(
      engine,
      // Intensity. Scaling from no intensity to half intensity by the end. Avoid using 1 as it will conflict with the final haptic event.
      intensity * 0.5,
      // Sharpness. Adding a baseline of 0.2 and then scaling the intensity by 0.2 gives a nice range of haptic feedback.
      0.2 + intensity * 0.2
    );
  }
}

// Threshold for triggering a haptic event, the larger this number is, the longer the gesture before the haptic event is triggered.
// Spacing this out gives a bit more texture to the event, helping each tap to feel more distinct.
// Lower numbers like 2-3 feel like a rubber band, while higher numbers (5-10) feel like a gear or a roller coaster.
const TAP_DISTANCE = 2;
// This is just a guess based on my iPhone 14 pro max. This should be the distance the user needs to pull down to trigger the refresh.
const refreshDistanceThreshold = Dimensions.get("window").height * 0.178111588;

export function ArcScrollView(props: ScrollViewProps) {
  const engine = useHapticsEngine();

  const isTouching = useRef(false);
  const lastPosition = useRef(0);
  const hasPopped = useRef(false);

  return (
    <ScrollView
      {...props}
      onScrollBeginDrag={(event) => {
        // The haptics map to the user scrolling, disable them when the user is not touching the screen.
        isTouching.current = true;
        props.onScrollBeginDrag?.(event);
      }}
      onScrollEndDrag={(event) => {
        isTouching.current = false;
        lastPosition.current = event.nativeEvent.contentOffset.y;
        props.onScrollEndDrag?.(event);
      }}
      onScroll={(event) => {
        props.onScroll?.(event);
        if (!isTouching.current) {
          return;
        }

        const offset = Math.max(-event.nativeEvent.contentOffset.y, 0);
        const threshold = refreshDistanceThreshold;

        const absProgress = offset / threshold;
        const progress = Math.min(absProgress, 1.0);

        // Apply ease-in effect to the progress
        const easedProgress = Easing.ease(progress);

        if (Math.abs(offset - lastPosition.current) >= TAP_DISTANCE) {
          if (hasPopped.current) {
            if (easedProgress < 1) {
              hasPopped.current = false;
            }
            return;
          } else {
            if (easedProgress >= 1) {
              hasPopped.current = true;
            }
            playHaptic(engine.current, easedProgress);
          }

          lastPosition.current = offset;
        }
      }}
    />
  );
}
