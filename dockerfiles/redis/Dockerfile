# 使用官方的 Redis 镜像作为基础镜像
FROM redis:7.2.5

WORKDIR /data

# 将自定义的配置文件拷贝到容器中
COPY ./redis.conf /usr/local/etc/redis/redis.conf
COPY ./redis.acl /usr/local/etc/redis/redis.acl

# 暴露Redis服务器的默认端口
EXPOSE 6379

VOLUME [ "/data", "/var/log/redis" ]

# 启动 Redis 时使用自定义配置文件
CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]
