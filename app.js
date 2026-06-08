// -- PDF.js Worker setup --
if (typeof pdfjsLib !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

// ── DOM Elements ──────────────────────────────
const candidateName   = document.getElementById('candidateName');
const jobRole         = document.getElementById('jobRole');
const targetCompany   = document.getElementById('targetCompany');
const keySkills       = document.getElementById('keySkills');
const jobDescription  = document.getElementById('jobDescription');
const generateTemplateBtn = document.getElementById('generateTemplateBtn');
const generateAIBtn   = document.getElementById('generateAIBtn');
const defaultState    = document.getElementById('defaultState');
const generatingState = document.getElementById('generatingState');
const outputCard      = document.getElementById('outputCard');
const coverLetterOutput = document.getElementById('coverLetterOutput');
const copyBtn         = document.getElementById('copyBtn');
const copySuccess     = document.getElementById('copySuccess');
const resumeFile      = document.getElementById('resumeFile');
const fileName        = document.getElementById('fileName');
const dropzone        = document.getElementById('dropzone');
const themeToggle     = document.getElementById('themeToggle');

// ── State ─────────────────────────────────────
let resumeText = '';

// ── Phase 1: Template Generator ───────────────
function generateTemplate(name, role, company, skills, jobDesc) {
  return `Dear Hiring Manager at ${company},

I am writing to express my strong interest in the ${role} position at ${company}. My name is ${name}, and I am a passionate and dedicated developer with hands-on experience in ${skills}.

Having reviewed the job description carefully, I am confident that my technical background aligns well with your requirements. ${jobDesc ? `The role particularly excites me because of the focus on: ${jobDesc.substring(0, 150)}...` : ''}

My key strengths include:
• Proficiency in ${skills}
• Strong problem-solving and debugging skills
• Ability to write clean, maintainable code
• Experience building production-ready applications

I am particularly drawn to ${company} because of its commitment to innovation and technical excellence. I am excited about the opportunity to contribute to your team and grow as a developer.

I would welcome the chance to discuss how my skills and enthusiasm can contribute to ${company}'s continued success.

Thank you for considering my application. I look forward to hearing from you.

Warm regards,
${name}`;
}

// ── Phase 2: Gemini API Call ──────────────────
async function generateWithGemini(name, role, company, skills, jobDesc, resume) {
  const prompt = `You are a professional cover letter writer.

Write a compelling, professional cover letter for the following candidate:

Candidate Name: ${name}
Job Role: ${role}
Target Company: ${company}
Key Skills: ${skills}
Job Description: ${jobDesc}
${resume ? `Resume Content: ${resume}` : ''}

Instructions:
- Write in a professional but personable tone
- Keep it to 3-4 paragraphs
- Highlight the candidate's skills relevant to the job
- Make it specific to the company
- Do not use placeholder text
- Start with "Dear Hiring Manager at ${company},"
- End with the candidate's name`;

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: prompt })
  });

  if (!response.ok) {
    throw new Error('API call failed');
  }

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  return text;
}

// ── Render Cover Letter ───────────────────────
function renderCoverLetter(text) {
  const paragraphs = text.split('\n').filter(p => p.trim() !== '');
  coverLetterOutput.innerHTML = paragraphs
    .map(p => `<p>${p}</p>`)
    .join('');
}

// ── Show States ───────────────────────────────
function showDefault() {
  defaultState.classList.remove('hidden');
  generatingState.classList.add('hidden');
  outputCard.classList.add('hidden');
}

function showGenerating() {
  defaultState.classList.add('hidden');
  generatingState.classList.remove('hidden');
  outputCard.classList.add('hidden');
}

function showOutput() {
  defaultState.classList.add('hidden');
  generatingState.classList.add('hidden');
  outputCard.classList.remove('hidden');
}

// ── Template Button ───────────────────────────
generateTemplateBtn.addEventListener('click', async function () {
  const name    = candidateName.value.trim();
  const role    = jobRole.value.trim();
  const company = targetCompany.value.trim();
  const skills  = keySkills.value.trim();
  const jobDesc = jobDescription.value.trim();

  if (!name || !role || !company || !skills) {
    alert('Please fill in all required fields!');
    return;
  }

  showGenerating();
  await new Promise(resolve => setTimeout(resolve, 1000));
  const coverLetter = generateTemplate(name, role, company, skills, jobDesc);
  renderCoverLetter(coverLetter);
  showOutput();
});

// ── AI Button ─────────────────────────────────
generateAIBtn.addEventListener('click', async function () {
  const name    = candidateName.value.trim();
  const role    = jobRole.value.trim();
  const company = targetCompany.value.trim();
  const skills  = keySkills.value.trim();
  const jobDesc = jobDescription.value.trim();

  if (!name || !role || !company || !skills) {
    alert('Please fill in all required fields!');
    return;
  }

  showGenerating();

  try {
    const coverLetter = await generateWithGemini(
      name, role, company, skills, jobDesc, resumeText
    );
    renderCoverLetter(coverLetter);
    showOutput();
  } catch (error) {
    console.error('AI error:', error);
    alert('AI generation failed! Using template instead.');
    const coverLetter = generateTemplate(name, role, company, skills, jobDesc);
    renderCoverLetter(coverLetter);
    showOutput();
  }
});

// ── Copy to Clipboard ─────────────────────────
copyBtn.addEventListener('click', function () {
  const text = coverLetterOutput.innerText;

  navigator.clipboard.writeText(text).then(function () {
    copySuccess.classList.remove('hidden');
    setTimeout(function () {
      copySuccess.classList.add('hidden');
    }, 3000);
  });
});

// ── PDF Resume Upload ─────────────────────────
resumeFile.addEventListener('change', async function (e) {
  const file = e.target.files[0];

  if (!file) return;

  fileName.textContent = '📄 ' + file.name;
  fileName.classList.remove('hidden');

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    resumeText = fullText;
    console.log('Resume extracted successfully:', resumeText.substring(0, 100));

  } catch (error) {
    console.error('PDF extraction error:', error);
    fileName.textContent = '❌ Could not read PDF';
  }
});

// ── Dropzone Click → File Input Trigger ───────
dropzone.addEventListener('click', function (e) {
  // file-input pe click already propagate hota hai via CSS (opacity:0, inset:0)
  // Ye extra handler Safari/mobile ke liye
  if (e.target !== resumeFile) {
    resumeFile.click();
  }
});

// ── Dropzone Drag & Drop ──────────────────────
dropzone.addEventListener('dragover', function (e) {
  e.preventDefault();
  dropzone.style.borderColor = 'var(--accent)';
});

dropzone.addEventListener('dragleave', function () {
  dropzone.style.borderColor = 'var(--border)';
});

dropzone.addEventListener('drop', function (e) {
  e.preventDefault();
  dropzone.style.borderColor = 'var(--border)';
  const file = e.dataTransfer.files[0];
  if (file && file.type === 'application/pdf') {
    resumeFile.files = e.dataTransfer.files;
    resumeFile.dispatchEvent(new Event('change'));
  }
});

// ── Dark / Light Mode Toggle ──────────────────
themeToggle.addEventListener('click', function () {
  document.body.classList.toggle('dark');

  if (document.body.classList.contains('dark')) {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem('theme', 'dark');
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', 'light');
  }
});

// ── Load Saved Theme ──────────────────────────
(function () {
  const saved = localStorage.getItem('theme');
  const prefersDark =
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (saved === 'dark' || (!saved && prefersDark)) {
    document.body.classList.add('dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
})();
