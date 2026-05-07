# Upgraded to the Gemini 3.1-era model selection path for the 2026 Codewarts
# Hackathon. The current official Gemini 3 Flash model ID is
# "gemini-3-flash-preview".
"""Lumos Barangay: Streamlit + Gemini Vision hackathon MVP.

This app lets a user upload a Philippine community photo, asks Gemini 3 Flash
Preview to describe opportunity gaps through the UN SDG lens, and logs a
simple Opportunity Score with Pandas so the team can visualize inequality data.

Run locally with:
    streamlit run apps/web/app.py
"""

from __future__ import annotations

import os
import random
from datetime import datetime
from pathlib import Path

import google.generativeai as genai
import pandas as pd
import streamlit as st
from dotenv import load_dotenv
from PIL import Image, UnidentifiedImageError


# The app file is apps/web/app.py, so parents[2] points back to the repo root.
REPO_ROOT = Path(__file__).resolve().parents[2]
ENV_PATH = REPO_ROOT / ".env"
LEDGER_PATH = REPO_ROOT / "data" / "inequality_ledger.csv"
LEDGER_COLUMNS = ["Timestamp", "Barangay_Name", "Opportunity_Score"]

# Gemini 1.5 Flash returns 404 for many projects now, so use Gemini 3 instead.
PREFERRED_GEMINI_MODEL = "gemini-3-flash-preview"
FALLBACK_GEMINI_MODELS = ["gemini-3.1-flash-lite"]
GEMINI_MODEL_CANDIDATES = [PREFERRED_GEMINI_MODEL, *FALLBACK_GEMINI_MODELS]

BARANGAY_NAME = "Scanned Area"
MIN_OPPORTUNITY_SCORE = 40
MAX_OPPORTUNITY_SCORE = 95

AI_PROMPT = (
    "You are an expert in the UN SDGs. Look at this photo of a Philippine "
    "community. Briefly identify: 1) Infrastructure health (SDG 11), "
    "2) Economic/Business activity (SDG 8), and 3) Recommended vocational "
    "training or education (SDG 4). Keep it short, structured, and easy to read."
)


class ModelCheckError(Exception):
    """Raised when every Gemini model candidate fails."""

    def __init__(
        self,
        attempted_models: dict[str, str],
        available_models: list[str],
    ) -> None:
        self.attempted_models = attempted_models
        self.available_models = available_models
        super().__init__("No configured Gemini model could generate a report.")


def configure_page() -> None:
    """Set up the Streamlit page before drawing UI elements."""
    st.set_page_config(
        page_title="Lumos Barangay",
        page_icon="🧙‍♂️",
        layout="wide",
    )


def load_api_key() -> str:
    """Load GEMINI_API_KEY from .env and stop the app if it is missing."""
    load_dotenv(ENV_PATH)

    # os.environ is read after load_dotenv so local .env values are available.
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        st.error(
            "Missing GEMINI_API_KEY. Please add it to the .env file, then rerun "
            "the app."
        )
        st.stop()

    return api_key


def configure_gemini(api_key: str) -> None:
    """Configure Google's SDK using the key loaded from .env."""
    genai.configure(api_key=api_key)


def open_uploaded_image(uploaded_file) -> Image.Image | None:
    """Convert a Streamlit upload into a PIL image for display and Gemini."""
    if uploaded_file is None:
        return None

    try:
        image = Image.open(uploaded_file)
        return image.convert("RGB")
    except UnidentifiedImageError:
        st.error("The uploaded file could not be read as an image.")
        return None


def list_available_generate_content_models() -> list[str]:
    """List models that report support for generateContent.

    This is the app's "Model Check" helper. When a model ID is wrong,
    discontinued, or unavailable for the current API key, this list helps the
    team pick a working model from Google AI Studio or the Gemini docs.
    """
    try:
        model_names = []
        for model in genai.list_models():
            methods = getattr(model, "supported_generation_methods", []) or []
            if "generateContent" not in methods:
                continue

            model_names.append(getattr(model, "name", str(model)))

        return sorted(model_names)
    except Exception as error:
        return [f"Could not list models: {error}"]


def generate_opportunity_report(
    image: Image.Image,
) -> tuple[str, str, dict[str, str], list[str]]:
    """Try Gemini 3 candidates and return the first successful report.

    The function starts with the preferred Gemini 3 Flash Preview model. If it
    fails, it runs the Model Check helper and then tries the fallback candidate.
    """
    attempted_models: dict[str, str] = {}
    available_models: list[str] = []

    for model_name in GEMINI_MODEL_CANDIDATES:
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content([AI_PROMPT, image])

            if not getattr(response, "text", None):
                raise RuntimeError("Gemini returned an empty response.")

            return response.text.strip(), model_name, attempted_models, available_models
        except Exception as error:
            attempted_models[model_name] = str(error)

            if model_name == PREFERRED_GEMINI_MODEL:
                available_models = list_available_generate_content_models()

    raise ModelCheckError(attempted_models, available_models)


def show_model_check(
    attempted_models: dict[str, str],
    available_models: list[str],
) -> None:
    """Display model diagnostics without hiding the main app from students."""
    if not attempted_models:
        return

    st.warning(
        "Model Check: the preferred Gemini model failed. Review the available "
        "models below if this keeps happening."
    )

    with st.expander("Model Check details", expanded=True):
        st.write("Attempted models and errors:")
        st.json(attempted_models)

        st.write("Available models that support generateContent:")
        if available_models:
            st.write(available_models)
        else:
            st.write("No model list was returned by the SDK.")


def read_ledger() -> pd.DataFrame:
    """Read the inequality ledger, creating an empty table when needed."""
    if not LEDGER_PATH.exists():
        return pd.DataFrame(columns=LEDGER_COLUMNS)

    try:
        ledger = pd.read_csv(LEDGER_PATH)
    except pd.errors.EmptyDataError:
        return pd.DataFrame(columns=LEDGER_COLUMNS)

    # Keep the exact expected columns so older/manual CSV edits do not break UI.
    for column in LEDGER_COLUMNS:
        if column not in ledger.columns:
            ledger[column] = None

    ledger = ledger[LEDGER_COLUMNS]
    ledger["Opportunity_Score"] = pd.to_numeric(
        ledger["Opportunity_Score"],
        errors="coerce",
    )
    return ledger.dropna(subset=["Opportunity_Score"])


def append_scan_to_ledger(opportunity_score: int) -> pd.DataFrame:
    """Add one scan result to data/inequality_ledger.csv."""
    LEDGER_PATH.parent.mkdir(parents=True, exist_ok=True)

    ledger = read_ledger()
    new_row = pd.DataFrame(
        [
            {
                "Timestamp": datetime.now().isoformat(timespec="seconds"),
                "Barangay_Name": BARANGAY_NAME,
                "Opportunity_Score": opportunity_score,
            }
        ]
    )

    updated_ledger = pd.concat([ledger, new_row], ignore_index=True)
    updated_ledger.to_csv(LEDGER_PATH, index=False)
    return updated_ledger


def draw_ledger_chart(ledger: pd.DataFrame) -> None:
    """Display historical Opportunity Scores as the SDG 10 proof point."""
    st.subheader("SDG 10 Inequality Ledger")

    if ledger.empty:
        st.info("No scans logged yet. Generate your first report to start the chart.")
        return

    chart_data = ledger[["Timestamp", "Opportunity_Score"]].set_index("Timestamp")
    st.bar_chart(chart_data)

    with st.expander("View raw CSV data"):
        st.dataframe(ledger, use_container_width=True, hide_index=True)


def main() -> None:
    """Run the Streamlit app."""
    # Step 1: Configure Streamlit and connect Gemini before accepting uploads.
    configure_page()
    api_key = load_api_key()
    configure_gemini(api_key)

    st.title("🧙‍♂️ Lumos Barangay: Opportunity Scanner")
    st.write(
        "Upload a photo of a street, market, school, or public area. Gemini will "
        "scan it for visible opportunity gaps, then Pandas will log the result."
    )

    uploaded_file = st.file_uploader(
        "Upload a community photo",
        type=["jpg", "jpeg", "png"],
    )

    # Step 2: Convert the uploaded file into a PIL image, which Gemini accepts.
    image = open_uploaded_image(uploaded_file)

    if image is not None:
        st.image(image, caption="Uploaded community photo", use_container_width=True)

    if st.button("Generate Opportunity Report", type="primary"):
        if image is None:
            st.warning("Please upload a JPG, JPEG, or PNG image first.")
            st.stop()

        # Step 3: Ask Gemini to analyze the real uploaded image.
        with st.spinner("Gemini is scanning the community photo..."):
            try:
                report, model_name, attempted_models, available_models = (
                    generate_opportunity_report(image)
                )
            except ModelCheckError as error:
                st.error("Gemini could not generate a report with any candidate model.")
                show_model_check(error.attempted_models, error.available_models)
                st.stop()
            except Exception as error:
                st.error(f"Gemini could not generate a report: {error}")
                show_model_check(
                    {PREFERRED_GEMINI_MODEL: str(error)},
                    list_available_generate_content_models(),
                )
                st.stop()

        show_model_check(attempted_models, available_models)

        # Step 4: Create MVP data science proof by logging a score with Pandas.
        opportunity_score = random.randint(
            MIN_OPPORTUNITY_SCORE,
            MAX_OPPORTUNITY_SCORE,
        )
        updated_ledger = append_scan_to_ledger(opportunity_score)

        st.subheader("AI Opportunity Report")
        st.info(report)
        st.caption(f"Generated with model: {model_name}")
        st.metric("Opportunity Score", opportunity_score)
        st.success(f"Logged this scan to {LEDGER_PATH}.")

        draw_ledger_chart(updated_ledger)
    else:
        draw_ledger_chart(read_ledger())


if __name__ == "__main__":
    main()
