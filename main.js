const $ = (selector) => document.querySelector(selector);
const themeToggle = $('#theme-toggle');
const savedTheme = localStorage.getItem('du런-theme');
const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === 'dark';
  themeToggle.innerHTML = '<span aria-hidden="true">' + (isDark ? '☀' : '☾') + '</span>';
  themeToggle.setAttribute('aria-label', isDark ? '화이트 모드로 전환' : '다크 모드로 전환');
  themeToggle.title = isDark ? '화이트 모드로 전환' : '다크 모드로 전환';
  document.querySelector('meta[name="theme-color"]').content = isDark ? '#171620' : '#f5f4ff';
}
setTheme(savedTheme || preferredTheme);
themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('du런-theme', nextTheme);
  setTheme(nextTheme);
});
const topics = ['첫 인상은 어떤 편인가요?', '요즘 푹 빠진 취미가 있나요?', '오늘 하루를 한 단어로 표현한다면?', '다시 가고 싶은 여행지가 있나요?', '요즘 가장 자주 듣는 노래는?', '쉬는 날엔 보통 뭘 하세요?'];
const replies = ['오, 그 얘기 더 듣고 싶어요!', '좋네요 :) 요즘 어떻게 지내세요?', '저도 비슷한 생각 해본 적 있어요.', '재밌다! 그럼 요즘 가장 좋았던 순간은 뭐예요?', '그렇군요. 오늘의 주제에도 딱 맞는 이야기네요!'];
let connected = false;
let replyTimer;

function toast(message) {
  const el = $('#toast'); el.textContent = message; el.classList.add('show');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 2400);
}
function addMessage(text, mine) {
  const messages = $('#messages');
  if (messages.querySelector('.welcome')) messages.innerHTML = '';
  const row = document.createElement('div'); row.className = `bubble-row${mine ? ' mine' : ''}`;
  if (!mine) { const avatar = document.createElement('span'); avatar.className = 'bubble-avatar'; avatar.textContent = $('#avatar').textContent; row.append(avatar); }
  const bubble = document.createElement('div'); bubble.className = 'bubble'; bubble.textContent = text;
  const time = document.createElement('time'); time.className = 'message-time'; time.textContent = new Intl.DateTimeFormat('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
  row.append(bubble, time); messages.append(row); messages.scrollTop = messages.scrollHeight;
}
function setConnected(value) {
  connected = value;
  $('#message-input').disabled = !value; $('#send-button').disabled = !value || !$('#message-input').value.trim();
  $('#start-button').hidden = value; $('#leave-button').hidden = !value;
  $('#partner-name').textContent = value ? '오늘의 익명 친구' : '새로운 인연';
  $('#partner-status').textContent = value ? '● 연결되었어요 · 익명 대화' : '아직 연결되지 않았어요';
  $('#partner-status').style.color = value ? '#59b98d' : '';
  $('#avatar').textContent = value ? '🌿' : '☁️';
  $('#demo-caption').textContent = value ? '데모 대화 중 · 입력한 메시지는 저장되지 않아요' : '미리보기 데모 · 실제 사용자와 연결되지는 않아요';
}
$('#start-button').addEventListener('click', () => {
  setConnected(true); $('#messages').innerHTML = ''; addMessage('안녕하세요! 반가워요 😊', false);
  toast('랜덤 친구와 연결되었어요!'); $('#message-input').focus();
});
$('#leave-button').addEventListener('click', () => {
  clearTimeout(replyTimer); setConnected(false); $('#typing').hidden = true;
  $('#messages').innerHTML = '<div class="welcome"><div class="welcome-icon">👋</div><strong>대화가 종료되었어요</strong><span>새로운 인연을 만나보세요.</span></div>';
  toast('대화에서 나왔어요.');
});
$('#message-input').addEventListener('input', (event) => {
  $('#char-count').textContent = `${event.target.value.length}/300`;
  $('#send-button').disabled = !connected || !event.target.value.trim();
});
$('#message-form').addEventListener('submit', (event) => {
  event.preventDefault(); const input = $('#message-input'); const message = input.value.trim();
  if (!connected || !message) return;
  addMessage(message, true); input.value = ''; $('#char-count').textContent = '0/300'; $('#send-button').disabled = true;
  $('#typing').hidden = false;
  replyTimer = setTimeout(() => { if (!connected) return; $('#typing').hidden = true; addMessage(replies[Math.floor(Math.random() * replies.length)], false); }, 1100 + Math.random() * 1000);
});
$('#topic-button').addEventListener('click', () => {
  const current = $('#topic').textContent; const choices = topics.filter((topic) => topic !== current);
  $('#topic').textContent = choices[Math.floor(Math.random() * choices.length)];
});
const dialog = $('#info-dialog');
function showDialog(title, copy) { $('#dialog-title').textContent = title; $('#dialog-copy').textContent = copy; dialog.showModal(); }
$('#help-button').addEventListener('click', () => showDialog('두런두런 이용 안내', '랜덤 채팅 시작하기를 누르면 데모 대화가 시작돼요. 메시지를 입력하면 화면에서 가상의 답장을 확인할 수 있어요. 이 페이지는 화면 미리보기이며 실제 사용자 연결은 지원하지 않아요.'));
$('#safety-button').addEventListener('click', () => showDialog('안전한 대화 안내', '개인정보나 연락처, 금융 정보를 공유하지 마세요. 불편한 대화는 언제든지 나가거나 신고할 수 있어요. 서로 존중하는 대화를 함께 만들어가요.'));
$('#privacy-button').addEventListener('click', () => showDialog('개인정보 안내', '이 데모는 입력한 메시지를 서버로 전송하거나 저장하지 않아요. 실제 서비스를 운영하려면 개인정보 처리 방침과 안전한 서버 구성이 필요해요.'));
$('.dialog-close').addEventListener('click', () => dialog.close()); $('.dialog-ok').addEventListener('click', () => dialog.close());
$('#report-button').addEventListener('click', () => showDialog('신고 및 차단', '현재는 화면 미리보기라 실제 신고 접수가 되지 않아요. 실제 서비스에서는 상대를 차단하고 운영자에게 신고할 수 있도록 연결해야 해요.'));
