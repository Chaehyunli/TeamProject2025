import React from 'react';
import { Html, Head, Body, Container, Text, Link, Button } from '@react-email/components';

export const EmailVerification = ({ username, verificationLink }) => {
    return (
        <Html>
            <Head />
            <Body style={styles.body}>
                <Container style={styles.container}>
                    <Text style={styles.title}>이메일 인증 요청</Text>
                    <Text style={styles.text}>{username}님, 가입을 완료하려면 이메일 인증을 진행해주세요.</Text>
                    <Button href={verificationLink} style={styles.button}>
                        이메일 인증하기
                    </Button>
                    <Text style={styles.footer}>
                        인증 링크는 20분 후 만료됩니다. 문제가 있다면 고객 지원팀에 문의하세요.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

const styles = {
    body: { backgroundColor: '#f4f4f4', padding: '20px', fontFamily: 'Arial, sans-serif' },
    container: { backgroundColor: '#fff', padding: '20px', borderRadius: '5px' },
    title: { fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' },
    text: { fontSize: '14px', marginBottom: '15px' },
    button: { backgroundColor: '#007bff', color: '#fff', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none' },
    footer: { fontSize: '12px', color: '#777', marginTop: '15px' },
};

export default EmailVerification;
