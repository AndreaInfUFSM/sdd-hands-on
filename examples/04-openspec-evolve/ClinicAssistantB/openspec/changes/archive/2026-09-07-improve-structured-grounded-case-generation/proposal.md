# Improve structured and grounded clinical case generation

## Summary

Improve clinical case generation by adding explicit pedagogical grounding and a structured representation of generated cases.

The current prototype relies too much on repeated LLM interpretation during the interaction. This makes the flow more fragile, increases unnecessary model calls, and leaves important case logic implicit in generated text.

## Scope

* Accept structured inputs for topic, learning objective, pedagogical rationale, and trusted medical source text.
* Build the LLM request from those inputs.
* Define and validate a structured schema for generated clinical cases.
* Represent case progression and expected responses in structured data when possible.
* Use application-side conditional logic instead of repeated LLM calls for deterministic progression.
* Retain provenance linking generated cases to their learning objective, rationale, and source material.
* Make major generation failures explicit, including connectivity/timeouts, service unavailability, limits, and invalid structured output.
* Preserve the current frontend identity and evolve it incrementally.

## Out of scope

* Vector-search RAG.
* Automated retrieval, reranking, or embedding pipelines.
* Local or edge LLM inference.
* Multi-provider switching.
* Broad frontend redesign.

## Expected outcome

Clinical cases should become grounded, validated structured objects that can be persisted and used by the application without repeatedly asking the LLM to reconstruct case state.

This should make the prototype easier to test, less fragile, and better prepared for future RAG and local-model experiments.
