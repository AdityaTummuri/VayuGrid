"""
Unit and Integration Tests for VayuGrid Gemini Multimodal & Vernacular Engine
Tests Pydantic schema validation, anti-spoofing rejection logic,
fallback resilience, and 6-language advisory synthesis.
"""

import pytest
from PIL import Image
import io

from app.models.forensic import (
    PollutionSourceEnum,
    PriorityLevelEnum,
    RecommendedULBAction,
    ForensicAuditResult,
    VernacularAdvisories
)
from app.core.prompts import (
    GEMINI_FORENSIC_SYSTEM_PROMPT,
    VERNACULAR_TRANSLATION_SYSTEM_PROMPT,
    build_audit_prompt_with_context,
    build_vernacular_prompt
)
from app.data.sample_audit_payloads import (
    SAMPLE_AUDIT_PAYLOADS,
    SPOOFING_REJECTION_FIXTURES,
    get_sample_by_archetype,
    get_sample_by_city,
    list_available_archetypes
)
from app.services.gemini_forensic import GeminiForensicService
from app.services.vernacular_service import VernacularService


def test_pollution_archetypes_count():
    """Verify that all 6 statutory pollution classifications exist."""
    archetypes = list_available_archetypes()
    assert len(archetypes) == 6
    assert "OPEN_MUNICIPAL_WASTE_BURNING" in archetypes
    assert "CONSTRUCTION_DEMOLITION_DUST" in archetypes
    assert "INDUSTRIAL_STACK_EMISSION" in archetypes
    assert "BIOMASS_STUBBLE_BURNING" in archetypes
    assert "HIGH_DENSITY_VEHICULAR_IDLING" in archetypes
    assert "UNPAVED_ROAD_SUSPENSION" in archetypes


def test_sample_payloads_pydantic_validity():
    """Ensure all sample payloads conform strictly to ForensicAuditResult schema."""
    for name, payload in SAMPLE_AUDIT_PAYLOADS.items():
        verif = payload["verification"]
        model = ForensicAuditResult.model_validate(verif)
        assert model.is_valid_environmental_hazard is True
        assert model.source_classification.value == name
        assert 0.0 <= model.severity_score <= 1.0
        assert 0.0 <= model.confidence_score <= 1.0
        assert model.estimated_plume_spread_radius_meters > 0
        assert len(model.detected_visual_markers) > 0
        assert model.recommended_ulb_action is not None
        assert isinstance(model.recommended_ulb_action.priority_level, PriorityLevelEnum)

        # Check vernacular advisories contain all 6 languages
        advisories = payload["vernacular_advisories"]
        advisory_model = VernacularAdvisories.model_validate(advisories)
        for lang in ["en", "hi", "te", "kn", "ta", "ml"]:
            val = getattr(advisory_model, lang)
            assert isinstance(val, str) and len(val) > 10


def test_anti_spoofing_fixtures_pydantic_validity():
    """Ensure spoofing rejection fixtures properly indicate invalid hazards."""
    for name, fixture in SPOOFING_REJECTION_FIXTURES.items():
        model = ForensicAuditResult.model_validate(fixture)
        assert model.is_valid_environmental_hazard is False
        assert model.rejection_reason is not None
        assert "ANTI_SPOOFING" in model.rejection_reason or "NO_HAZARD" in model.rejection_reason
        assert model.severity_score == 0.0
        assert model.estimated_plume_spread_radius_meters == 0


def test_audit_prompt_generation():
    """Verify context prompt construction with geo-coordinates."""
    prompt = build_audit_prompt_with_context(
        latitude=28.6139,
        longitude=77.2090,
        city_hint="Delhi-NCR",
        reported_by="CITIZEN_MOBILE_APP"
    )
    assert "Delhi-NCR" in prompt
    assert "28.613900" in prompt
    assert "77.209000" in prompt
    assert "CITIZEN_MOBILE_APP" in prompt
    assert "anti-spoofing" in prompt.lower()


def test_gemini_service_resilient_fallback():
    """Ensure service provides valid forensic results even without live credentials."""
    service = GeminiForensicService(api_key="mock_key")
    # Generate a dummy synthetic image
    img = Image.new("RGB", (100, 100), color="orange")
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format="JPEG")
    image_bytes = img_byte_arr.getvalue()

    result = service.audit_image(
        image_data=image_bytes,
        city_hint="delhi_ncr",
        latitude=28.6253,
        longitude=77.3298
    )

    assert isinstance(result, ForensicAuditResult)
    assert result.is_valid_environmental_hazard is True
    assert result.source_classification == PollutionSourceEnum.OPEN_MUNICIPAL_WASTE_BURNING
    assert result.severity_score > 0.0
    assert result.estimated_plume_spread_radius_meters > 0


def test_vernacular_service_translation_fallback():
    """Verify fallback vernacular advisory output across all 6 languages."""
    service = VernacularService(api_key=None)
    advisories = service.generate_advisories(
        source_classification="CONSTRUCTION_DEMOLITION_DUST",
        severity_score=0.75,
        city_name="Bengaluru"
    )

    assert isinstance(advisories, VernacularAdvisories)
    assert "construction" in advisories.en.lower() or "dust" in advisories.en.lower()
    assert len(advisories.hi) > 0  # Hindi text present
    assert len(advisories.te) > 0  # Telugu text present
    assert len(advisories.kn) > 0  # Kannada text present
    assert len(advisories.ta) > 0  # Tamil text present
    assert len(advisories.ml) > 0  # Malayalam text present


def test_vernacular_speech_synthesis_fallback():
    """Verify fallback speech response handles missing credentials gracefully."""
    service = VernacularService(api_key=None)
    speech = service.synthesize_speech(
        text="Heavy dust alert nearby. Please wear protective masks.",
        language_code="hi"
    )

    assert speech.language_code == "hi"
    assert speech.text == "Heavy dust alert nearby. Please wear protective masks."
    assert speech.is_fallback is True
    assert speech.audio_format == "web-speech-api"
