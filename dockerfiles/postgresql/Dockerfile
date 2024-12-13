# 使用官方 PostgreSQL 镜像
FROM postgres:16.3-bullseye

# 设置环境变量
ENV POSTGRES_DB demo
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD password

# 复制自定义配置文件到容器中
COPY postgresql.conf /etc/postgresql/postgresql.conf

VOLUME /var/lib/postgresql/data

# 启动 PostgreSQL 服务
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]

EXPOSE 5432
