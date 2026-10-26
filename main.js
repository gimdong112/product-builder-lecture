const $ = (selector) => document.querySelector(selector);
const themeButton = $('#theme-toggle');
const themeMeta = $('meta[name="theme-color"]');
const questionOutput = $('#question-prompt');
const questions = [
  '요즘 하루 중 가장 기다려지는 순간은 언제인가요?',
  '최근에 다시 보고 싶다고 생각한 영화나 영상이 있나요?',
  '어릴 때 좋아했고 지금도 좋아하는 것이 있나요?',
  '쉬는 날에 꼭 지키고 싶은 작은 루틴이 있나요?',
  '요즘 누군가에게 추천하고 싶은 노래가 있나요?',
  '최근에 배운 것 중 의외로 재미있었던 건 무엇인가요?',
  '기분 전환이 필요할 때 가장 먼저 하는 일은 무엇인가요?',
  '언젠가 천천히 배워보고 싶은 취미가 있나요?',
  '오늘 하루를 색깔로 표현한다면 어떤 색일까요?'
];

function readSavedTheme() {
  try { return localStorage.getItem('malui-theme'); }
  catch { return null; }
}
function setTheme(theme, save) {
  document.documentElement.dataset.theme = theme;
  const dark = theme === 'dark';
  themeButton.textContent = dark ? '☀' : '☾';
  themeButton.setAttribute('aria-label', dark ? '라이트 모드로 전환' : '다크 모드로 전환');
  themeButton.title = dark ? '라이트 모드로 전환' : '다크 모드로 전환';
  themeMeta.setAttribute('content', dark ? '#191820' : '#f6f4ef');
  if (save) {
    try { localStorage.setItem('malui-theme', theme); } catch { /* 저장이 차단되어도 현재 화면 테마는 바뀝니다. */ }
  }
}

const savedTheme = readSavedTheme();
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
setTheme(savedTheme || systemTheme, false);
themeButton.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(next, true);
});

const questionButton = $('#new-question');
if (questionButton && questionOutput) {
  questionButton.addEventListener('click', () => {
    const current = questionOutput.textContent;
    const choices = questions.filter((question) => question !== current);
    questionOutput.textContent = choices[Math.floor(Math.random() * choices.length)];
  });
}