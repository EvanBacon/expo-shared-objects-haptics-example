import ExpoModulesCore
import CoreHaptics

extension CHHapticEventParameter: @retroactive Convertible, AnyArgument {
    public static func convert(from value: Any?, appContext: AppContext) throws -> Self {
        guard let dict = value as? [String: Any],
              let parameterIDRaw = dict["parameterID"] as? String,
              let value = dict["value"] as? Double else {
            throw NotADictionaryException()
        }
        return Self(parameterID: CHHapticEvent.ParameterID(rawValue: parameterIDRaw), value: Float(value))
    }
}

extension CHHapticEvent: @retroactive Convertible, AnyArgument {
    public static func convert(from value: Any?, appContext: AppContext) throws -> Self {
        guard let dict = value as? [String: Any],
              let eventTypeRaw = dict["eventType"] as? String,
              let relativeTime = dict["relativeTime"] as? Double else {
            throw NotADictionaryException()
        }
        let eventType = CHHapticEvent.EventType(rawValue: eventTypeRaw)
        let parameters = (dict["parameters"] as? [[String: Any]])?.compactMap { paramDict -> CHHapticEventParameter? in
            try? CHHapticEventParameter.convert(from: paramDict, appContext: appContext)
        } ?? []
        return Self(eventType: eventType, parameters: parameters, relativeTime: relativeTime)
    }
}

extension CHHapticDynamicParameter: @retroactive Convertible, AnyArgument {
    public static func convert(from value: Any?, appContext: AppContext) throws -> Self {
        guard let dict = value as? [String: Any],
              let parameterIDRaw = dict["parameterID"] as? String,
              let value = dict["value"] as? Double,
              let relativeTime = dict["relativeTime"] as? Double else {
            throw NotADictionaryException()
        }
        
        return Self(parameterID: CHHapticDynamicParameter.ID(rawValue: parameterIDRaw), value: Float(value), relativeTime: relativeTime)
    }
}

extension CHHapticPattern: @retroactive Convertible, AnyArgument {
    public static func convert(from value: Any?, appContext: AppContext) throws -> Self {
        guard let dict = value as? [String: Any],
              let eventsArray = dict["events"] as? [[String: Any]] else {
            throw NotADictionaryException()
        }
        let events = try eventsArray.map { eventDict -> CHHapticEvent in
            try CHHapticEvent.convert(from: eventDict, appContext: appContext)
        }
        let parameters = (dict["parameters"] as? [[String: Any]])?.compactMap { paramDict -> CHHapticDynamicParameter? in
            return try? CHHapticDynamicParameter.convert(from: paramDict, appContext: appContext)
        } ?? []
        return try Self(events: events, parameters: parameters)
    }
}

internal final class NotAnArrayException: Exception {
    override var reason: String {
        "Given value is not an array"
    }
}

internal final class IncorrectArraySizeException: GenericException<(expected: Int, actual: Int)> {
    override var reason: String {
        "Given array has unexpected number of elements: \(param.actual), expected: \(param.expected)"
    }
}

internal final class NotADictionaryException: Exception {
    override var reason: String {
        "Given value is not a dictionary"
    }
}

public class MyModule: Module {
    public func definition() -> ModuleDefinition {
        Name("MyModule")
        
        Constants([
            "HapticParameters": [
                "hapticIntensity": CHHapticEvent.ParameterID.hapticIntensity.rawValue,
                "hapticSharpness": CHHapticEvent.ParameterID.hapticSharpness.rawValue,
                "attackTime": CHHapticEvent.ParameterID.attackTime.rawValue,
                "decayTime": CHHapticEvent.ParameterID.decayTime.rawValue,
                "releaseTime": CHHapticEvent.ParameterID.releaseTime.rawValue,
                "sustained": CHHapticEvent.ParameterID.sustained.rawValue,
                "audioVolume": CHHapticEvent.ParameterID.audioVolume.rawValue,
                "audioPitch": CHHapticEvent.ParameterID.audioPitch.rawValue,
                "audioPan": CHHapticEvent.ParameterID.audioPan.rawValue,
                "audioBrightness": CHHapticEvent.ParameterID.audioBrightness.rawValue
            ]
        ])
        
        Class(HapticEngine.self) {
            Constructor {
                return HapticEngine()
            }
            
            Function("start") { (engine: HapticEngine) in
                try engine.start()
            }
            
            Function("stop") { (engine: HapticEngine) in
                try engine.stop()
            }
            
            Function("playPattern") { (engine: HapticEngine, pattern: CHHapticPattern) in
                try engine.playPattern(from: pattern)
            }
        }
    }
}

class HapticEngine: SharedObject {
    var engine: CHHapticEngine?
    
    override init() {
        do {
            self.engine = try CHHapticEngine()
        } catch {
            self.engine = nil
        }
    }
    
    func start() throws {
        try engine?.start()
    }
    
    func stop() throws {
        engine?.stop(completionHandler: nil)
    }
    
    func playPattern(from pattern: CHHapticPattern) throws {
        guard let engine = engine else {
            throw EngineNotStartedException()
        }
        
        if #available(iOS 16.0, *) {
            let player = try engine.makePlayer(with: pattern)
            try player.start(atTime: 0)
        } else {
            // Fallback on earlier versions
        }
    }
}

internal final class EngineNotStartedException: Exception {
    override var reason: String {
        "Haptic Engine is not started"
    }
}
