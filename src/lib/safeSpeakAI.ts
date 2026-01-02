export interface ReportOutput {
    category: string;
    sentiment: string;
    risk_score: number;
    risk_level: "L0" | "L1" | "L2" | "L3";
    route_to: string;
    human_review_required: boolean;
    details: {
        full_emotion_data: {
            primary_emotion: string;
            scores: Record<string, number>;
        };
        rule_triggered: boolean;
        original_text: string;
    };
}

// AI backend URL - configurable via VITE_AI_API_URL for production (e.g., Render). Falls back to localhost for local dev.
const AI_API_URL = (import.meta as any).env?.VITE_AI_API_URL || "http://localhost:8000";

export async function analyzeReport(text: string): Promise<ReportOutput> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const response = await fetch(`${AI_API_URL.replace(/\/$/, '')}/analyze`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`AI Service Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to analyze report:", error);
        // Fallback or re-throw depending on app needs
        throw error;
    }
}

// Demo analyzer used for presentations when the real AI backend isn't available.
export async function analyzeReportDemo(text: string): Promise<ReportOutput> {
    const lowered = (text || '').toLowerCase().trim();

    // 1. Check against Training Data (Simulating "Learning")
    // We look for exact or close matches in your training examples
    try {
        const { TRAINING_EXAMPLES } = await import('./trainingData');

        // Find the best matching example (simple inclusion check for now)
        const match = TRAINING_EXAMPLES.find(ex =>
            lowered.includes(ex.text.toLowerCase()) || ex.text.toLowerCase().includes(lowered)
            // Or if the input is very similar to an example
        );

        if (match) {
            console.log(`AI Memory Match: "${match.text}" -> ${match.category}`);

            let risk_level: ReportOutput['risk_level'] = 'L1';
            let route_to = 'counselor';
            let category: string = match.category;
            let risk_score = 0.8;

            // Map training categories to System Risk Levels
            switch (match.category) {
                case 'teacher_bullying':
                    risk_level = 'L3'; // Critical: Teacher involved
                    route_to = 'higher_authority';
                    category = 'teacher_involved';
                    risk_score = 0.95;
                    break;
                case 'physical_abuse':
                case 'safety_threat':
                    risk_level = 'L3'; // Critical: Safety
                    route_to = 'principal';
                    category = 'physical_threat';
                    risk_score = 0.98;
                    break;
                case 'mental_health':
                    risk_level = 'L3'; // Critical: Self harm risk
                    route_to = 'suicide_prevention';
                    category = 'self_harm';
                    risk_score = 0.95;
                    break;
                case 'bullying':
                case 'cyberbullying':
                    risk_level = 'L2';
                    route_to = 'counselor';
                    category = 'bullying';
                    break;
                case 'prank':
                case 'normal_discipline':
                    risk_level = 'L0'; // Dismiss
                    route_to = 'filtered';
                    risk_score = 0.1;
                    break;
                case 'emotional_distress':
                case 'academic_pressure':
                    risk_level = 'L1';
                    route_to = 'counselor';
                    break;
                default:
                    risk_level = 'L1';
            }

            return {
                category,
                sentiment: 'serious',
                risk_score,
                risk_level,
                route_to,
                human_review_required: risk_level !== 'L0',
                details: {
                    full_emotion_data: { primary_emotion: 'analyzed', scores: {} },
                    rule_triggered: true,
                    original_text: text,
                }
            };
        }
    } catch (e) {
        console.warn('Failed to load training data, falling back to rules:', e);
    }

    // 2. Fallback to Regex Rules if no specific training example matched
    const teacherPattern = /\b(teacher|t\s*\.?\s*r|mr\.?|ms\.?|staff|prof)\b/;
    const physicalPattern = /\b(kill|stab|shoot|threat|assault|weapon|force|hurt|hit|beat)\b/;
    const sexualPattern = /\b(rape|sexual|molest|sexual assault)\b/;
    const selfHarmPattern = /\b(suicide|kill myself|end my life|cut myself)\b/;

    let risk_level: ReportOutput['risk_level'] = 'L0';
    let route_to = 'triage';
    let risk_score = 0.0;
    let category = 'other';

    if (teacherPattern.test(lowered)) {
        risk_level = 'L3';
        route_to = 'higher_authority';
        risk_score = 0.92;
        category = 'teacher_involved';
    } else if (physicalPattern.test(lowered)) {
        risk_level = 'L3';
        route_to = 'higher_authority';
        risk_score = 0.95;
        category = 'physical_threat';
    } else if (sexualPattern.test(lowered)) {
        risk_level = 'L3';
        route_to = 'higher_authority';
        risk_score = 0.94;
        category = 'sexual_abuse';
    } else if (selfHarmPattern.test(lowered)) {
        risk_level = 'L3';
        route_to = 'suicide_prevention';
        risk_score = 0.97;
        category = 'self_harm';
    } else if (lowered.includes('bully') || lowered.includes('bullying') || lowered.includes('harass')) {
        risk_level = 'L2';
        route_to = 'school_counselor';
        risk_score = 0.6;
        category = 'bullying';
    } else {
        risk_level = 'L1';
        route_to = 'counselor_review';
        risk_score = 0.2;
        category = 'other';
    }

    return {
        category,
        sentiment: 'neutral',
        risk_score,
        risk_level,
        route_to,
        human_review_required: true,
        details: {
            full_emotion_data: {
                primary_emotion: 'neutral',
                scores: {},
            },
            rule_triggered: true,
            original_text: text,
        }
    };
}
