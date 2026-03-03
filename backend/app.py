import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

LANGUAGES = [
    {"code": "auto", "name": "Auto Detect", "speechCode": "en-US"},
    {"code": "en", "name": "English", "speechCode": "en-US"},
    {"code": "es", "name": "Spanish", "speechCode": "es-ES"},
    {"code": "fr", "name": "French", "speechCode": "fr-FR"},
    {"code": "de", "name": "German", "speechCode": "de-DE"},
    {"code": "it", "name": "Italian", "speechCode": "it-IT"},
    {"code": "pt", "name": "Portuguese", "speechCode": "pt-BR"},
    {"code": "ru", "name": "Russian", "speechCode": "ru-RU"},
    {"code": "ja", "name": "Japanese", "speechCode": "ja-JP"},
    {"code": "zh", "name": "Chinese (Simplified)", "speechCode": "zh-CN"},
    {"code": "ko", "name": "Korean", "speechCode": "ko-KR"},
    {"code": "ar", "name": "Arabic", "speechCode": "ar-SA"},
    {"code": "hi", "name": "Hindi", "speechCode": "hi-IN"},
    {"code": "bn", "name": "Bengali", "speechCode": "bn-IN"},
    {"code": "pa", "name": "Punjabi", "speechCode": "pa-IN"},
    {"code": "te", "name": "Telugu", "speechCode": "te-IN"},
    {"code": "mr", "name": "Marathi", "speechCode": "mr-IN"},
    {"code": "ta", "name": "Tamil", "speechCode": "ta-IN"},
    {"code": "gu", "name": "Gujarati", "speechCode": "gu-IN"},
    {"code": "kn", "name": "Kannada", "speechCode": "kn-IN"},
    {"code": "ml", "name": "Malayalam", "speechCode": "ml-IN"},
    {"code": "th", "name": "Thai", "speechCode": "th-TH"},
    {"code": "vi", "name": "Vietnamese", "speechCode": "vi-VN"},
    {"code": "id", "name": "Indonesian", "speechCode": "id-ID"},
    {"code": "ms", "name": "Malay", "speechCode": "ms-MY"},
    {"code": "tr", "name": "Turkish", "speechCode": "tr-TR"},
    {"code": "ur", "name": "Urdu", "speechCode": "ur-PK"},
    {"code": "fa", "name": "Persian", "speechCode": "fa-IR"},
    {"code": "he", "name": "Hebrew", "speechCode": "he-IL"},
    {"code": "nl", "name": "Dutch", "speechCode": "nl-NL"},
    {"code": "pl", "name": "Polish", "speechCode": "pl-PL"},
    {"code": "sv", "name": "Swedish", "speechCode": "sv-SE"},
    {"code": "da", "name": "Danish", "speechCode": "da-DK"},
    {"code": "no", "name": "Norwegian", "speechCode": "nb-NO"},
    {"code": "fi", "name": "Finnish", "speechCode": "fi-FI"},
    {"code": "el", "name": "Greek", "speechCode": "el-GR"},
    {"code": "cs", "name": "Czech", "speechCode": "cs-CZ"},
    {"code": "sk", "name": "Slovak", "speechCode": "sk-SK"},
    {"code": "ro", "name": "Romanian", "speechCode": "ro-RO"},
    {"code": "hu", "name": "Hungarian", "speechCode": "hu-HU"},
    {"code": "uk", "name": "Ukrainian", "speechCode": "uk-UA"},
    {"code": "sl", "name": "Slovenian", "speechCode": "sl-SI"},
    {"code": "hr", "name": "Croatian", "speechCode": "hr-HR"},
    {"code": "sr", "name": "Serbian", "speechCode": "sr-RS"},
    {"code": "bg", "name": "Bulgarian", "speechCode": "bg-BG"},
    {"code": "lt", "name": "Lithuanian", "speechCode": "lt-LT"},
    {"code": "lv", "name": "Latvian", "speechCode": "lv-LV"},
    {"code": "et", "name": "Estonian", "speechCode": "et-EE"},
]


@app.route("/api/languages", methods=["GET"])
def get_languages():
    return jsonify(LANGUAGES)


@app.route("/api/translate", methods=["POST"])
def translate():
    data = request.get_json()

    text = data.get("text", "").strip()
    source = data.get("source", "en")
    target = data.get("target", "es")

    # Validation
    if not text:
        return jsonify({"error": "Please enter text to translate."}), 400

    if len(text) > 5000:
        return jsonify({"error": "Text exceeds the 5,000 character limit."}), 400

    if source != "auto" and source == target:
        return jsonify({"error": "Source and target languages must be different."}), 400

    api_choice = os.getenv("TRANSLATION_API", "mymemory").lower()

    if api_choice == "google":
        result = translate_google(text, source, target)
    elif api_choice == "microsoft":
        result = translate_microsoft(text, source, target)
    else:
        result = translate_mymemory(text, source, target)

    if "error" in result:
        return jsonify(result), 502

    return jsonify(result)


# ─── MyMemory (free, no key required) ────────────────────────────────────────
def translate_mymemory(text: str, source: str, target: str) -> dict:
    try:
        # MyMemory auto-detection: use "|target" format (empty source before pipe)
        lang_pair = f"|{target}" if source == "auto" else f"{source}|{target}"
        url = "https://api.mymemory.translated.net/get"
        params = {"q": text, "langpair": lang_pair}
        resp = requests.get(url, params=params, timeout=10)
        resp.raise_for_status()
        json_data = resp.json()

        if json_data.get("responseStatus") == 200:
            translated = json_data["responseData"]["translatedText"]
            return {"translatedText": translated}
        else:
            return {"error": json_data.get("responseDetails", "Translation failed.")}
    except requests.exceptions.Timeout:
        return {"error": "Translation request timed out. Please try again."}
    except Exception as e:
        return {"error": f"Translation service error: {str(e)}"}


# ─── Google Translate (requires GOOGLE_API_KEY in .env) ──────────────────────
def translate_google(text: str, source: str, target: str) -> dict:
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return {"error": "Google API key not configured."}
    try:
        url = "https://translation.googleapis.com/language/translate/v2"
        payload = {"q": text, "source": source if source != "auto" else None,
                   "target": target, "key": api_key, "format": "text"}
        payload = {k: v for k, v in payload.items() if v is not None}
        resp = requests.post(url, json=payload, timeout=10)
        resp.raise_for_status()
        translated = resp.json()["data"]["translations"][0]["translatedText"]
        return {"translatedText": translated}
    except Exception as e:
        return {"error": f"Google Translate error: {str(e)}"}


# ─── Microsoft Translator (requires MICROSOFT_API_KEY in .env) ───────────────
def translate_microsoft(text: str, source: str, target: str) -> dict:
    api_key = os.getenv("MICROSOFT_API_KEY")
    region = os.getenv("MICROSOFT_REGION", "eastus")
    if not api_key:
        return {"error": "Microsoft API key not configured."}
    try:
        url = "https://api.cognitive.microsofttranslator.com/translate"
        headers = {
            "Ocp-Apim-Subscription-Key": api_key,
            "Ocp-Apim-Subscription-Region": region,
            "Content-Type": "application/json",
        }
        params = {"api-version": "3.0", "to": target}
        if source != "auto":
            params["from"] = source
        body = [{"text": text}]
        resp = requests.post(url, headers=headers, params=params, json=body, timeout=10)
        resp.raise_for_status()
        translated = resp.json()[0]["translations"][0]["text"]
        return {"translatedText": translated}
    except Exception as e:
        return {"error": f"Microsoft Translator error: {str(e)}"}


if __name__ == "__main__":
    app.run(debug=True, port=5000)
