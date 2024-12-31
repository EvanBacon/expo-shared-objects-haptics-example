// This was AI generated based on the Swift/Kotlin code.

import { NativeModule, requireNativeModule } from "expo";

type HapticEventParameter = {
  parameterID: string;
  value: number;
};

type HapticEvent = {
  eventType: string;
  parameters: HapticEventParameter[];
  relativeTime: number;
};

type HapticDynamicParameter = {
  parameterID: string;
  value: number;
  relativeTime: number;
};

type HapticPattern = {
  events: HapticEvent[];
  parameters?: HapticDynamicParameter[];
};

/** Represents a haptic engine for playing haptic patterns. */
export declare class HapticEngine {
  constructor();
  /**
   * Starts the haptic engine.
   * @throws Will throw an error if the engine could not be started.
   * @platform iOS 13.0 and above
   */
  start(): void;
  /**
   * Stops the haptic engine.
   * @throws Will throw an error if the engine could not be stopped.
   * @platform iOS 13.0 and above
   */
  stop(): void;
  /**
   * Plays a haptic pattern.
   * @param pattern The haptic pattern to play.
   * @throws Will throw an error if the engine is not started or the pattern is invalid.
   * @platform iOS 13.0 and above
   */
  playPattern(pattern: HapticPattern): void;
}

declare class MyModuleType extends NativeModule {
  // Constants
  /** Haptic event parameter IDs available for configuration. */
  CHHapticEvent: {
    ParameterID: {
      hapticIntensity: string;
      hapticSharpness: string;
      attackTime: string;
      decayTime: string;
      releaseTime: string;
      sustained: string;
      audioVolume: string;
      audioPitch: string;
      audioPan: string;
      audioBrightness: string;
    };
    EventType: {
      hapticTransient: string;
      hapticContinuous: string;
      audioContinuous: string;
      audioCustom: string;
    };
  };
  /** Haptic dynamic parameter IDs available for configuration. */
  CHHapticDynamicParameter: {
    ID: {
      hapticIntensityControl: string;
      hapticSharpnessControl: string;
      hapticAttackTimeControl: string;
      hapticDecayTimeControl: string;
      hapticReleaseTimeControl: string;
      audioVolumeControl: string;
      audioPitchControl: string;
      audioPanControl: string;
      audioBrightnessControl: string;
      audioAttackTimeControl: string;
      audioDecayTimeControl: string;
      audioReleaseTimeControl: string;
    };
  };
  // Shared objects
  HapticEngine: typeof HapticEngine;
}

export const MyModule = requireNativeModule<MyModuleType>("MyModule");

export default MyModule;
