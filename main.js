const renderAudioList = (items) => {
  const wrapper = document.createElement("div");
  wrapper.className = "audio-list";

  items.forEach(({ label, src }) => {
    const item = document.createElement("div");
    item.className = "audio-item";

    const title = document.createElement("span");
    title.textContent = label;

    const audio = document.createElement("audio");
    audio.controls = true;
    audio.preload = "none";
    audio.src = src;

    item.append(title, audio);
    wrapper.append(item);
  });

  return wrapper;
};

const renderTextList = (items) => {
  const wrapper = document.createElement("div");
  wrapper.className = "text-list";

  items.forEach(({ label, text }) => {
    const item = document.createElement("div");
    item.className = "text-item";

    const title = document.createElement("span");
    title.textContent = label;

    const content = document.createElement("div");
    content.textContent = text;

    item.append(title, content);
    wrapper.append(item);
  });

  return wrapper;
};

const createTable = (headers) => {
  const table = document.createElement("table");
  table.className = "table";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  table.appendChild(tbody);

  return { table, tbody };
};

const renderEmotionExamples = (data) => {
  const container = document.getElementById("emotion-table");
  container.innerHTML = "";

  const { table, tbody } = createTable([
    "Emotion sequence",
    "Text",
    "References",
    "Ours",
    "Baselines",
  ]);

  data.forEach((item) => {
    const row = document.createElement("tr");

    const sequenceCell = document.createElement("td");
    sequenceCell.textContent = item.emotion_sequence || "-";

    const textCell = document.createElement("td");
    textCell.textContent = item.text || "-";

    const referenceCell = document.createElement("td");
    if (item.reference_audio) {
      const entries = Object.entries(item.reference_audio).map(([label, src]) => ({
        label,
        src,
      }));
      referenceCell.appendChild(renderAudioList(entries));
    } else if (item.reference_text) {
      const entries = Object.entries(item.reference_text).map(([label, text]) => ({
        label,
        text,
      }));
      referenceCell.appendChild(renderTextList(entries));
    } else {
      referenceCell.textContent = "-";
    }

    const outputCell = document.createElement("td");
    if (item.output_audio) {
      outputCell.appendChild(renderAudioList([{ label: "Output", src: item.output_audio }]));
    } else {
      outputCell.textContent = "-";
    }

    const baselineCell = document.createElement("td");
    if (item.baseline_audio) {
      const entries = Object.entries(item.baseline_audio).map(([label, src]) => ({
        label,
        src,
      }));
      baselineCell.appendChild(renderAudioList(entries));
    } else {
      baselineCell.textContent = "-";
    }

    row.append(sequenceCell, textCell, referenceCell, outputCell, baselineCell);
    tbody.appendChild(row);
  });

  container.appendChild(table);
};

const renderDurationExamples = (data) => {
  const container = document.getElementById("duration-table");
  container.innerHTML = "";

  const { table, tbody } = createTable([
    "Text",
    "Reference",
    "Original",
    "Ours",
    "Baselines",
  ]);

  data.forEach((item) => {
    const row = document.createElement("tr");

    const textCell = document.createElement("td");
    textCell.textContent = item.text || "-";

    const referenceCell = document.createElement("td");
    if (item.reference_audio) {
      referenceCell.appendChild(
        renderAudioList([{ label: "Reference", src: item.reference_audio }])
      );
    } else {
      referenceCell.textContent = "-";
    }

    const originalCell = document.createElement("td");
    if (item.original_audio) {
      originalCell.appendChild(
        renderAudioList([{ label: "Original", src: item.original_audio }])
      );
    } else {
      originalCell.textContent = "-";
    }

    const outputCell = document.createElement("td");
    if (item.output_audio) {
      outputCell.appendChild(renderAudioList([{ label: "Output", src: item.output_audio }]));
    } else {
      outputCell.textContent = "-";
    }

    const baselineCell = document.createElement("td");
    if (item.baseline_audio) {
      const entries = Object.entries(item.baseline_audio).map(([label, src]) => ({
        label,
        src,
      }));
      baselineCell.appendChild(renderAudioList(entries));
    } else {
      baselineCell.textContent = "-";
    }

    row.append(textCell, referenceCell, originalCell, outputCell, baselineCell);
    tbody.appendChild(row);
  });

  container.appendChild(table);
};

const loadExamples = async () => {
  try {
    const response = await fetch("examples/data.json");
    if (!response.ok) {
      throw new Error(`Failed to load examples: ${response.status}`);
    }
    const data = await response.json();

    renderEmotionExamples(data.emotion || []);
    renderDurationExamples(data.duration || []);
  } catch (error) {
    const emotionContainer = document.getElementById("emotion-table");
    const durationContainer = document.getElementById("duration-table");
    const message = document.createElement("p");
    message.className = "muted";
    message.textContent = `Unable to load examples/data.json: ${error.message}`;

    emotionContainer.appendChild(message.cloneNode(true));
    durationContainer.appendChild(message);
  }
};

loadExamples();
