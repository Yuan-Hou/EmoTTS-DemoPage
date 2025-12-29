# Training-Free Intra-Utterance Control for Zero-Shot TTS (Demo Page)

This branch is for a **static Demo Page**. It focuses on:
- A **high-level introduction** of the project/paper
- **Key method highlights** (training-free, intra-utterance emotion transitions, segment-level duration control, automatic prompt construction)
- A few **representative examples** (audio + text/prompt)

> Note: This Demo Page **does not provide interactive functionality** (no online inference, no parameter tuning, no file upload, etc.).

---

## 1. Overview

We propose a **training-free (no fine-tuning)** controllable framework for **pretrained zero-shot autoregressive TTS**, enabling **intra-utterance**:
- **Segment-level emotion** expression with smooth transitions  
- **Segment-level duration / speaking-rate** control with globally consistent termination

Unlike most controllable TTS systems that apply a single emotion or rate to an entire utterance, our approach operates at **inference time** by restructuring how conditioning information is accessed and updated during autoregressive decoding. This achieves stable fine-grained control while preserving the base model’s zero-shot capability and speech quality.

---

## 2. Method Overview (Key Information for the Demo Page)

### 2.1 Segment-Aware Emotion Conditioning (Multi-Segment Emotion Control)
Goal: Apply different emotion conditions to different text spans **without breaking global semantic coherence**.

Core components:
- **2D Segment-Aware Attention Mask**
  - Standard causal context over text/semantic tokens remains intact (to preserve semantic coherence)
  - Visibility to **emotion condition embeddings** is **strictly segmented**: tokens in segment *k* can only attend to `C_k`, while all other `C_j` are masked out
- **Bayesian Alignment Filtering (Online Alignment Filtering)**
  - During decoding, attention is treated as an observation to maintain a probability distribution over which text token the current semantic token aligns to
  - A Predict–Select–Update cycle suppresses noise and enforces monotonic progress
  - When the expected alignment crosses a segment boundary, the system **automatically switches emotion**, enabling more stable intra-utterance transitions

### 2.2 Segment-Aware Duration Steering (Multi-Segment Duration Control)
Goal: Adjust local pacing (speed up / slow down within segments) while ensuring the utterance does not end too early or drag on.

Core components:
- **Local Duration Embedding Steering**
  - Dynamically adjusts the duration embedding lookup based on **within-segment progress error**, providing online correction
- **Global EOS Logit Modulation**
  - **Suppress EOS** in earlier segments to prevent premature termination
  - In the final segment, progressively encourages EOS according to the remaining semantic budget, ensuring **globally consistent termination**

### 2.3 Automatic Prompt Construction
To avoid manual segmentation and prompt engineering:
- We build a **30,000-sample** bilingual (English/Chinese) dataset annotated with multi-emotion and duration information
- We fine-tune **Qwen3-4B** to transform raw user text into **multi-segment structured prompts** (emotion descriptions + duration estimates)

---

## 3. Suggested Demo Content Structure (What This Branch Should Cover)

> The Demo Page is recommended to include the following sections; this README aligns page content with asset organization.

### 3.1 One-Line Takeaways (Hero)
- **Training-free**: no training/distillation or extra time-aligned speech annotations
- **Intra-utterance**: supports multi-emotion transitions and segment-level duration control within one utterance
- **Zero-shot preserved**: maintains the base TTS model’s zero-shot synthesis capability and speech quality

### 3.2 Method Figures (Optional)
The page may include:
- Overall pipeline figure (`intro.png`)
- Emotion-control workflow (mask + alignment-based switching, `emotion_control.png`)

### 3.3 Examples (Core of the Demo Page)
Each example is shown as: **Text → Segmented Prompt → Audio**, organized by tasks:

- **A. Multi-Emotion (Intra-Utterance Emotion Transitions)**
  - 3–5 English examples, 3–5 Chinese examples
  - Cover: smooth transitions / abrupt transitions
  - Cover combinations of: happy / sad / angry / surprised / fearful / disgusted / neutral

- **B. Multi-Duration (Segment-Level Duration / Speaking Rate)**
  - 3–5 English examples, 3–5 Chinese examples
  - Cover: local speed-up, local slow-down, precise finishing in the final segment
  - Optionally show a short textual comparison: “target duration vs perceived pacing”

- **C. Joint Emotion + Duration Control (Optional)**
  - 2–4 examples, highlighting stable emotion transitions plus pacing changes

- **D. Baseline / Comparison (Optional)**
  - 1–2 examples comparing with the base/representative systems:
    - baseline (no segment-level control)
    - utterance-level emotion/rate control only (cannot change within an utterance)
