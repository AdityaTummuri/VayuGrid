"""
VayuGrid Forensic & Vernacular Pydantic Data Models
Defines strict schemas for Gemini multimodal classification, anti-spoofing validation,
statutory municipal intervention, and multi-language advisories.
"""

from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class PollutionSourceEnum(str, Enum):
    """6-Way statutory pollution classification archetypes."""
    OPEN_MUNICIPAL_WASTE_BURNING = "OPEN_MUNICIPAL_WASTE_BURNING"
    CONSTRUCTION_DEMOLITION_DUST = "CONSTRUCTION_DEMOLITION_DUST"
    INDUSTRIAL_STACK_EMISSION = "INDUSTRIAL_STACK_EMISSION"
    BIOMASS_STUBBLE_BURNING = "BIOMASS_STUBBLE_BURNING"
    HIGH_DENSITY_VEHICULAR_IDLING = "HIGH_DENSITY_VEHICULAR_IDLING"
    UNPAVED_ROAD_SUSPENSION = "UNPAVED_ROAD_SUSPENSION"


class PriorityLevelEnum(str, Enum):
    """ULB enforcement priority levels."""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class RecommendedULBAction(BaseModel):
    """Statutory municipal intervention recommended by Gemini."""
    intervention_type: str = Field(
        ...,
        description="Recommended action, e.g. 'Deploy Water Sprinkler Tanker and Issue Bylaw Fine'",
        examples=["Deploy Water Sprinkler Tanker and Issue Bylaw Fine"]
    )
    target_department: str = Field(
        ...,
        description="Responsible ULB municipal department or statutory body",
        examples=["Municipal Solid Waste Enforcement / East Delhi Municipal Corp"]
    )
    priority_level: PriorityLevelEnum = Field(
        ...,
        description="Urgency of intervention",
        examples=[PriorityLevelEnum.CRITICAL]
    )


class ForensicAuditResult(BaseModel):
    """Schema returned by Gemini Multimodal Forensic Audit Pipeline."""
    is_valid_environmental_hazard: bool = Field(
        ...,
        description="False if image fails anti-spoofing (indoor, computer screen, selfie, meme, clear sky)",
        examples=[True]
    )
    rejection_reason: Optional[str] = Field(
        None,
        description="Explanation if the image was rejected due to anti-spoofing or lack of hazard"
    )
    source_classification: Optional[PollutionSourceEnum] = Field(
        None,
        description="One of the 6 canonical pollution classifications",
        examples=[PollutionSourceEnum.OPEN_MUNICIPAL_WASTE_BURNING]
    )
    severity_score: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Hazard severity score from 0.0 (negligible) to 1.0 (extreme)",
        examples=[0.88]
    )
    confidence_score: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Model confidence in visual forensic classification",
        examples=[0.94]
    )
    optical_smoke_opacity: float = Field(
        0.0,
        ge=0.0,
        le=1.0,
        description="Estimated optical plume opacity (0.0=transparent haze to 1.0=pitch black / dense dust)",
        examples=[0.85]
    )
    estimated_plume_spread_radius_meters: int = Field(
        ...,
        ge=0,
        description="Estimated source footprint and initial plume radius in meters",
        examples=[450]
    )
    detected_visual_markers: List[str] = Field(
        default_factory=list,
        description="Forensic visual cues identified in the imagery",
        examples=[[
            "Dense black toxic smoke",
            "Combustion of mixed plastics and municipal refuse",
            "Uncontrolled open flame adjacent to transit corridor"
        ]]
    )
    recommended_ulb_action: Optional[RecommendedULBAction] = Field(
        None,
        description="Targeted municipal action recommendation"
    )
    summary_assessment: Optional[str] = Field(
        None,
        description="Concise statutory forensic summary for municipal commissioners"
    )


class VernacularAdvisories(BaseModel):
    """Multi-language synthesized emergency advisories across 6 Indian languages."""
    en: str = Field(..., description="English advisory")
    hi: str = Field(..., description="Hindi (हिंदी) advisory")
    te: str = Field(..., description="Telugu (తెలుగు) advisory")
    kn: str = Field(..., description="Kannada (ಕನ್ನಡ) advisory")
    ta: str = Field(..., description="Tamil (தமிழ்) advisory")
    ml: str = Field(..., description="Malayalam (മലയാളം) advisory")


class VernacularAudioRequest(BaseModel):
    """Payload to request audio synthesis for an advisory."""
    text: str = Field(..., description="Text string to synthesize")
    language_code: str = Field(..., description="Language code: en, hi, te, kn, ta, or ml")


class VernacularAudioResponse(BaseModel):
    """Response containing synthesized speech audio."""
    language_code: str
    text: str
    audio_base64: Optional[str] = None
    audio_format: str = "audio/mp3"
    is_fallback: bool = False
