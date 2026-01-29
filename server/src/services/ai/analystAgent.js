const { analystModel } = require("../../config/aiConfig");
const { analystPromptTemplate } = require("./prompts/analystPrompt");
const { AnalystReportSchema } = require("./schemas/analystSchema");

/**
 * THE ANALYST AGENT
 * Input: Cleaned CarContext (from Ingestion)
 * Output: Marketing Strategy (AnalystReport)
 */
async function analyzeCar(carContext) {
  console.log("🧠 Analyst Agent: Thinking...");

  try {
    // 1. OPTIMIZE INPUT
    // We remove the 'raw_api_dump' to save tokens and prevent noise.
    // The Analyst only needs the clean, normalized data.
    const leanContext = {
      identity: carContext.identity,
      visuals: carContext.visual_directives,
      specs: carContext.normalized_specs,
      intelligence: carContext.derived_intelligence,
      available_badges: carContext.certifications,
    };

    // 2. CONFIGURE THE CHAIN
    // .withStructuredOutput(ZodSchema) is the magic.
    // It forces Llama 3 to output strict JSON matching our schema.
    const chain = analystPromptTemplate.pipe(
      analystModel.withStructuredOutput(AnalystReportSchema)
    );

    // 3. EXECUTE
    const report = await chain.invoke({
      car_context_json: JSON.stringify(leanContext, null, 2),
    });

    console.log(
      `🧠 Analyst Agent: Done. Persona identified as "${report.marketing_persona}"`
    );
    return report;
  } catch (error) {
    console.error("❌ Analyst Agent Failed:", error);
    throw new Error("Failed to analyze car context.");
  }
}

module.exports = { analyzeCar };
