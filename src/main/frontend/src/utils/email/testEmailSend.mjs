import { sendVerificationEmail } from './sendVerificationEmail.mjs';

sendVerificationEmail('kth1322@naver.com', '사용자', 'http://localhost:3000/verify')
    .then(() => console.log('✅ 이메일 전송 성공'))
    .catch((err) => console.error('❌ 이메일 전송 실패:', err));
