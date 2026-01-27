import { useEffect, useState } from "react";
import { useAIUXStore } from "../store/useAIUXStore";
import { AIWhisper } from "../components/AIWhisper";
import { AnimatePresence } from "framer-motion";

export function AIIntentOrchestrator() {
    const intent = useAIUXStore(s => s.currentIntent);
    const uxMode = useAIUXStore(s => s.uxMode);
    const [whisperTopic, setWhisperTopic] = useState(null);

    const copyFor = (topic) => {
        const map = {
            condition: "This vehicle has passed a 150-point inspection.",
            mileage: "Low mileage for its class.",
            battery: "Battery health is at 98%.",
            comfort: "Experience the premium leather seats.",
            value: "Great value for this trim level.",
            efficiency: "Fuel efficient city driving.",
        };
        return map[topic] || topic;
    };

    useEffect(() => {
        if (!intent) return;

        // HARD RULES
        if (uxMode === "browse" && intent.type === "highlight") return;

        if (intent.type === "reassure" && intent.topic) {
            setWhisperTopic(intent.topic);
            const timer = setTimeout(() => setWhisperTopic(null), 5000);
            return () => clearTimeout(timer);
        } else if (intent.type === "close") {
            setWhisperTopic(null);
        }
    }, [intent, uxMode]);

    return (
        <AnimatePresence>
            {whisperTopic && <AIWhisper key="whisper" text={copyFor(whisperTopic)} />}
        </AnimatePresence>
    );
}
