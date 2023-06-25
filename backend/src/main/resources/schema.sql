DROP TABLE IF EXISTS task ;
CREATE TABLE task (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  description VARCHAR(255) NOT NULL,
  done TINYINT(1) NOT NULL
);
