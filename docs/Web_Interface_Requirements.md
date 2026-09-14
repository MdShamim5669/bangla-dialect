# Web Interface Requirements — Bangla Regional Dialect → Standard Bengali Translator

This document contains everything needed to build a working web interface for the finalized BanglaT5 dialect
translation model. Give this file (and the accompanying `app.py` starter code) directly to whoever is building
the interface — it contains the exact technical details the model requires to work correctly.

---

## 1. What This App Does

A simple web page where a user:
1. **Selects a region** from a dropdown/selector: Pabna, Noakhali, Jashore, Rangpur, Mymensingh, Barishal, or
   Chittagong.
2. **Types a sentence** in that region's dialect (in Bengali script) into a text box.
3. Clicks a **"Translate"** button.
4. Sees the **Standard Bengali translation** appear as output.

That's the entire core functionality. No login, no database, no multi-page navigation needed.

---

## 2. CRITICAL: Exact Input Format the Model Requires

**This is the single most important detail — get this wrong and the model will produce garbage output even
though nothing else is broken.**

The model was fine-tuned expecting input text in this exact format (a plain string, not JSON, not special
tokens — just this literal text pattern fed into the tokenizer):

```
translate {region} to Bangla: {dialect_sentence}
```

Where `{region}` must be **exactly one of these seven strings, spelled and capitalized exactly like this**:
`Pabna`, `Noakhali`, `Jashore`, `Rangpur`, `Mymensingh`, `Barishal`, `Chittagong`

**Example:** if the user selects "Chittagong" from the dropdown and types "ক্যান আছু?", the actual string sent
to the model must be:

```
translate Chittagong to Bangla: ক্যান আছু?
```

Do not translate, alter, or localize the word "translate," "to," or "Bangla" in this prefix — the model was
trained on this literal English-language instruction template and expects it unchanged.

---

## 3. Model Details

- **Base architecture:** BanglaT5 (`csebuetnlp/banglat5`), fine-tuned (sequence-to-sequence, encoder-decoder).
- **Framework:** Hugging Face `transformers` (Python), PyTorch backend.
- **Where the trained model currently lives:** saved inside the Google Colab session that trained it, at a path
  like `banglat5_final_outputs/banglat5_model` (or `checkpoint-7000` inside a checkpoints folder). **This will
  disappear when the Colab session ends** — see Section 4 for how to move it somewhere permanent before building
  the web app.

---

## 4. REQUIRED FIRST STEP: Move the Model Out of Colab

Before any web interface can use this model, it needs to live somewhere the web app's server can load it from.
The simplest, most reliable option is uploading it to the **Hugging Face Hub** (free, works with any Python
hosting later, and `transformers` can load directly from it by name).

**Run this in the same Colab session where the trained model exists** (do this once):

```python
from huggingface_hub import login
login()  # paste a Hugging Face access token when prompted (create one free at huggingface.co/settings/tokens)

# Point this at wherever the final trained model was saved
MODEL_PATH = "banglat5_final_outputs/banglat5_model"  # adjust if your actual final save path differs

model.push_to_hub("your-username/banglat5-dialect-to-standard")
tokenizer.push_to_hub("your-username/banglat5-dialect-to-standard")
```

(Replace `your-username` with an actual Hugging Face account username, and `model`/`tokenizer` with whatever
variable names hold the final trained model/tokenizer in that notebook — if they're not already loaded in memory,
load them first with `AutoModelForSeq2SeqLM.from_pretrained(MODEL_PATH)` before pushing.)

After this, the model can be loaded from **anywhere** (a laptop, a server, Hugging Face Spaces) with:

```python
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
tokenizer = AutoTokenizer.from_pretrained("your-username/banglat5-dialect-to-standard")
model = AutoModelForSeq2SeqLM.from_pretrained("your-username/banglat5-dialect-to-standard")
```

If keeping the model private is preferred (not visible to the public), pass `private=True` to `push_to_hub()`,
and anyone loading it later will need to be logged in with an authorized Hugging Face account.

---

## 5. Recommended Technology: Gradio

For a text-in / text-out ML model demo like this, **Gradio** (a Python library) is strongly recommended over
building a separate frontend (React/HTML/JavaScript) and backend (Flask/FastAPI) from scratch. Reasons:
- It is built specifically for exactly this kind of interface (input box + dropdown + button + output box).
- The entire app is written in **one Python file**, no separate HTML/CSS/JavaScript needed.
- It automatically renders a clean, mobile-friendly web page.
- It can be deployed for free on **Hugging Face Spaces** with just a few clicks (no server management).

A working starter file (`app.py`) is provided alongside this document — see Section 7.

**Alternative (if more visual customization is wanted later):** Streamlit is a similar Python-only option with
more layout flexibility. A custom Flask/FastAPI + HTML/JavaScript build is also possible but requires
significantly more code for the same result and is not necessary for this use case.

---

## 6. Exact Decoding Settings to Use at Inference Time

To match how the model was evaluated (so the web app's output quality matches the reported results), generation
must use these exact settings:

```python
output_ids = model.generate(
    **tokenizer(input_text, return_tensors="pt", truncation=True, max_length=40),
    max_new_tokens=32,
    num_beams=4,
    length_penalty=1.0,
    early_stopping=True,
)
translated_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)
```

Do not change `num_beams` (beam search width) without a reason — `4` was the specific value selected after
testing multiple options on the validation set; changing it may make the web app's output quality look worse
than the model actually is.

---

## 7. Functional Requirements Checklist

- [ ] A dropdown or button-group listing all 7 regions (exact spelling from Section 2), single-select only.
- [ ] A multi-line text input box for the dialect sentence (should support Bengali script; ensure the page's
      HTML has `<meta charset="UTF-8">` and a font that renders Bengali, e.g. `Noto Sans Bengali` or the
      browser/OS default Bengali font — most modern systems handle this automatically).
- [ ] A "Translate" button.
- [ ] An output area showing the Standard Bengali translation after the button is clicked.
- [ ] A loading/spinner indicator while the model is generating (inference can take 1-3 seconds on CPU, faster
      on GPU) — Gradio handles this automatically.
- [ ] Basic error handling: if the input box is empty when "Translate" is clicked, show a message asking the
      user to type something, rather than sending an empty string to the model.
- [ ] (Nice to have, optional) A few example sentences per region as clickable buttons, so users can try the
      demo without typing anything themselves.

## 8. Non-Functional Requirements

- The interface should be usable on both desktop and mobile screen sizes (Gradio handles this by default).
- Inference does not require a GPU to function, but responses will be slower on CPU (a few seconds per
  sentence) — acceptable for a demo, not necessarily for high-traffic production use.
- No user data needs to be stored or logged for this to function as a demo; if usage analytics are wanted later,
  that is a separate, optional addition.

---

## 9. What NOT to Build (Out of Scope)

- No user accounts / login system needed.
- No database needed — this is a stateless, single-request-in / single-response-out tool.
- No support for the reverse direction (Standard → Dialect) — the finalized model only translates dialect
  input into Standard Bengali output, not the other way around.
- No Banglish or English input support — the model was trained and evaluated only on Bengali-script dialect
  input; feeding it Banglish or English text is unsupported and untested (see the project's Limitations notes).
