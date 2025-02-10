import { render } from '@react-email/render';
import EmailVerification from '../../components/emailTemplates/EmailVerification.js';

export function generateVerificationEmail(username, verificationLink) {
    return render(EmailVerification({ username, verificationLink }));
}



/* 💡 Descriptions
*
*      react-email/render 라는 라이브러리를 써서
*      React Component 중 EmailVerification.js 를 HTML 문자열로 변환한다.
*      왜냐하면, Email Verification 부분은 보안 상의 이유로 JS 를 지원하지 않아서
*      HTML 을 써야하는데, 그냥 냅다 HTML 을 쓰면 재사용성 이슈가 있으니 이러한 방식을 채택하는 것이다.
*
*      동작은 Component 를 render() 함수로 HTML 로 만듦
* */

/* ⚠️ ESM 방식으로 바꿔야 하는데 (현재 CommonJS 방식), package.json 에서 건드리면 문제 생길지도 모르니,
      우선 email 관련 부분만 .mjs 로 바꾼 후, 추후 문제없겠다 싶으면 package.json 수정하던가 해야겠음
* */