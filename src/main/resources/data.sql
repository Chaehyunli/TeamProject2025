-- 카테고리 데이터 삽입 (중복 삽입 방지)
INSERT INTO categories (category_name) VALUES ('IT/프로그래밍') ON DUPLICATE KEY UPDATE category_name=category_name;
INSERT INTO categories (category_name) VALUES ('예술/공연') ON DUPLICATE KEY UPDATE category_name=category_name;
INSERT INTO categories (category_name) VALUES ('봉사활동') ON DUPLICATE KEY UPDATE category_name=category_name;
INSERT INTO categories (category_name) VALUES ('운동/스포츠') ON DUPLICATE KEY UPDATE category_name=category_name;
INSERT INTO categories (category_name) VALUES ('학술/스터디') ON DUPLICATE KEY UPDATE category_name=category_name;
INSERT INTO categories (category_name) VALUES ('기타') ON DUPLICATE KEY UPDATE category_name=category_name;

-- 대학교 데이터 삽입 (중복 삽입 방지)
INSERT INTO universities (university_name) VALUES ('서울대학교') ON DUPLICATE KEY UPDATE university_name=university_name;
INSERT INTO universities (university_name) VALUES ('연세대학교') ON DUPLICATE KEY UPDATE university_name=university_name;
INSERT INTO universities (university_name) VALUES ('고려대학교') ON DUPLICATE KEY UPDATE university_name=university_name;
INSERT INTO universities (university_name) VALUES ('한양대학교') ON DUPLICATE KEY UPDATE university_name=university_name;
INSERT INTO universities (university_name) VALUES ('성균관대학교') ON DUPLICATE KEY UPDATE university_name=university_name;
INSERT INTO universities (university_name) VALUES ('명지대학교') ON DUPLICATE KEY UPDATE university_name=university_name;
